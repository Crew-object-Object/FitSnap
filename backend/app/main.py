from fastapi import FastAPI
from app.routes import router

app = FastAPI(title="AI Fit Predictor")

app.include_router(router)

@app.get("/")
def home():
    return {"message": "AI Fit Predictor API is running!"}
