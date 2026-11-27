from contextlib import asynccontextmanager
from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from inference import ai_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    ai_service.load()
    yield

app = FastAPI(
    title="MedEase PyTorch Model Service",
    description="FastAPI microservice serving symptom_transformer.pt for Express.js backend",
    version="1.0.0",
    lifespan=lifespan
)

class PredictRequest(BaseModel):
    symptom_indices: List[int]
    top_k: int = 3

@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": ai_service.is_loaded,
        "num_conditions": len(ai_service.condition_to_index)
    }

@app.post("/predict")
def predict(req: PredictRequest):
    return ai_service.predict(req.symptom_indices, top_k=req.top_k)
