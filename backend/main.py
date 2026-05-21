import asyncio
import json
import uuid
from datetime import datetime
from typing import List, Literal, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

app = FastAPI(title="DroughtGuard AI API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

import os

# Load model configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model.json")

try:
    with open(MODEL_PATH, "r") as f:
        MODEL_CONFIG = json.load(f)
except Exception as e:
    print(f"Error loading model.json from {MODEL_PATH}: {e}")
    MODEL_CONFIG = {}

# In-memory history storage
prediction_history = []


class PredictionInput(BaseModel):
    temperature: float
    rainfall: float
    humidity: float
    soil_moisture: float
    wind_speed: float
    vegetation_index: float
    evapotranspiration: float
    region: str


class PredictionResult(BaseModel):
    prediction: Literal["Drought Likely", "No Drought"]
    confidence: int
    risk_level: Literal["Low", "Moderate", "Severe"]
    timestamp: str
    id: str
    region: str


@app.get("/")
async def root():
    return {"message": "DroughtGuard AI API is running"}


@app.post("/api/predict", response_model=PredictionResult)
async def predict(input_data: PredictionInput):
    if not MODEL_CONFIG:
        raise HTTPException(status_code=500, detail="Model configuration not loaded")

    # Simulate processing time
    await asyncio.sleep(1.5)

    params = MODEL_CONFIG["parameters"]
    thresholds = MODEL_CONFIG["thresholds"]

    score = 0.0

    # Normalize and weight inputs (matching frontend logic)
    score += (input_data.temperature / 50.0) * params["temperature"]["weight"]
    score += (1.0 - min(input_data.rainfall / 300.0, 1.0)) * abs(
        params["rainfall"]["weight"]
    )
    score += (1.0 - input_data.humidity / 100.0) * abs(params["humidity"]["weight"])
    score += (1.0 - input_data.soil_moisture / 100.0) * abs(
        params["soil_moisture"]["weight"]
    )
    score += (1.0 - input_data.vegetation_index) * abs(
        params["vegetation_index"]["weight"]
    )
    score += (input_data.evapotranspiration / 10.0) * params["evapotranspiration"][
        "weight"
    ]

    final_score = max(0.0, min(1.0, score))

    risk_level: Literal["Low", "Moderate", "Severe"] = "Low"
    prediction: Literal["Drought Likely", "No Drought"] = "No Drought"

    if final_score >= thresholds["severe"]:
        risk_level = "Severe"
        prediction = "Drought Likely"
    elif final_score >= thresholds["moderate"]:
        risk_level = "Moderate"
        prediction = "Drought Likely"
    elif final_score >= thresholds["low"]:
        risk_level = "Low"
        prediction = "No Drought"

    result = PredictionResult(
        prediction=prediction,
        confidence=round(final_score * 100),
        risk_level=risk_level,
        timestamp=datetime.now().isoformat(),
        id=str(uuid.uuid4())[:8],
        region=input_data.region,
    )

    # Add to history (keep last 20)
    prediction_history.insert(0, result)
    if len(prediction_history) > 20:
        prediction_history.pop()

    return result


@app.get("/api/history", response_model=List[PredictionResult])
async def get_history():
    return prediction_history


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
