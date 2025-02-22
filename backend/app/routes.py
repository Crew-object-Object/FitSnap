from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np
from app.segmentation import segment_body_mediapipe

router = APIRouter()

@router.post("/predict-size/")
async def predict_size(file: UploadFile = File(...)):
    # Read the uploaded image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run segmentation
    mask = segment_body_mediapipe(image)

    # (TODO: Extract measurements and map to size)
    return {"size": "M"}  # Placeholder response
