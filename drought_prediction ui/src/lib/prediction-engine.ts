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
}

export async function runPrediction(input: PredictionInput): Promise<PredictionResult> {
  try {
    const response = await fetch('/model.json');
    const model = await response.json();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    let score = 0;
    
    // Simple heuristic prediction based on model weights
    // Lower rainfall/humidity/soil moisture increases drought score
    // Higher temperature/evapotranspiration increases drought score
    
    // Normalize and weight inputs
    // Temperature: 0-50 range
    score += (input.temperature / 50) * model.parameters.temperature.weight;
    
    // Rainfall: 0-500 range (inverted: less rain = higher score)
    score += (1 - Math.min(input.rainfall / 300, 1)) * Math.abs(model.parameters.rainfall.weight);
    
    // Humidity: 0-100 range (inverted)
    score += (1 - input.humidity / 100) * Math.abs(model.parameters.humidity.weight);
    
    // Soil Moisture: 0-100 range (inverted)
    score += (1 - input.soil_moisture / 100) * Math.abs(model.parameters.soil_moisture.weight);
    
    // Vegetation Index: 0-1 range (inverted)
    score += (1 - input.vegetation_index) * Math.abs(model.parameters.vegetation_index.weight);
    
    // Evapotranspiration: 0-10 range
    score += (input.evapotranspiration / 10) * model.parameters.evapotranspiration.weight;

    // Constrain score between 0 and 1
    const finalScore = Math.max(0, Math.min(1, score));
    
    let risk_level: "Low" | "Moderate" | "Severe" = "Low";
    let prediction: "Drought Likely" | "No Drought" = "No Drought";
    
    if (finalScore >= model.thresholds.severe) {
      risk_level = "Severe";
      prediction = "Drought Likely";
    } else if (finalScore >= model.thresholds.moderate) {
      risk_level = "Moderate";
      prediction = "Drought Likely";
    } else if (finalScore >= model.thresholds.low) {
      risk_level = "Low";
      prediction = "No Drought";
    }

    return {
      prediction,
      confidence: Math.round(finalScore * 100),
      risk_level,
      timestamp: new Date().toISOString(),
      id: Math.random().toString(36).substring(7)
    };
  } catch (error) {
    console.error("Prediction failed:", error);
    throw new Error("Failed to process prediction model");
  }
}