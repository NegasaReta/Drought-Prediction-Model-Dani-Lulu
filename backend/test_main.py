import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "DroughtGuard AI API is running"}


def test_predict_endpoint():
    payload = {
        "temperature": 40,
        "rainfall": 10,
        "humidity": 20,
        "soil_moisture": 10,
        "wind_speed": 20,
        "vegetation_index": 0.2,
        "evapotranspiration": 8.0,
        "region": "Test Desert",
    }
    # We expect a "Drought Likely" result for these extreme conditions
    response = client.post("/api/predict", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "prediction" in data
    assert "confidence" in data
    assert "risk_level" in data
    assert data["prediction"] == "Drought Likely"
    assert data["risk_level"] == "Severe"


def test_history_endpoint():
    # First, make a prediction to ensure history isn't empty
    payload = {
        "temperature": 25,
        "rainfall": 150,
        "humidity": 60,
        "soil_moisture": 45,
        "wind_speed": 12,
        "vegetation_index": 0.7,
        "evapotranspiration": 3.5,
        "region": "Test Region",
    }
    client.post("/api/predict", json=payload)

    response = client.get("/api/history")
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    assert data[0]["region"] == "Test Region"
