export interface PredictionInput {
  temperature: number;
  rainfall: number;
  humidity: number;
  soil_moisture: number;
  wind_speed: number;
  vegetation_index: number;
  evapotranspiration: number;
  region: string;
}

export interface PredictionResult {
  prediction: "Drought Likely" | "No Drought";
  confidence: number;
  risk_level: "Low" | "Moderate" | "Severe";
  timestamp: string;
  id: string;
  region: string;
}

const API_BASE_URL = "http://localhost:8000";

export async function runPrediction(
  input: PredictionInput,
): Promise<PredictionResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Prediction failed:", error);
    throw new Error("Failed to process prediction via backend API");
  }
}

export async function fetchHistory(): Promise<PredictionResult[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/history`);
    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch history:", error);
    return [];
  }
}
