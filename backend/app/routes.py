from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np
from joblib import load
import pandas as pd
from pathlib import Path
import mediapipe as mp
from mediapipe.tasks import python
from mediapipe.tasks.python import vision

BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path="pose_landmarker_heavy.task"),
    running_mode=VisionRunningMode.IMAGE)

router = APIRouter()
model = load(str(Path("models/size_predictor_model.joblib")))

# Segmentation setup
mp_selfie_segmentation = mp.solutions.selfie_segmentation
segmenter = mp_selfie_segmentation.SelfieSegmentation(model_selection=1)

def segment_body_mediapipe(image):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = segmenter.process(image_rgb)
    mask = results.segmentation_mask > 0.5  # Thresholding
    return (mask.astype(np.uint8) * 255)

@router.post("/predict-size/")
async def predict_size(file: UploadFile = File(...)):
    # Read the uploaded image
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    image = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Run segmentation
    mask = segment_body_mediapipe(image)

    # Find contours of the body
    contours, _ = cv2.findContours(mask.astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return {"error": "No body detected"}
    
    # Get the largest contour (assumed to be the body)
    body_contour = max(contours, key=cv2.contourArea)
    
    # Get bounding rectangle measurements
    x, y, w, h = cv2.boundingRect(body_contour)
    
    # Calculate basic measurements
    chest_height = y + int(h * 0.25)  # Approximate chest location
    waist_height = y + int(h * 0.45)  # Approximate waist location
    
    # Get width at these points and normalize by image width
    image_width = mask.shape[1]
    chest_width = (np.sum(mask[chest_height, :]) / 255) / image_width * 300  # Increased scaling factor
    waist_width = (np.sum(mask[waist_height, :]) / 255) / image_width * 100
    
    # Get nose landmark from mediapipe
    detector = vision.PoseLandmarker.create_from_options(options)
    results = detector.detect(image)
    print(results)
    if results['pose_landmarks']:
        nose = results.pose_landmarks.landmark[0]  # Nose is landmark 0
        
        # Calculate angle from nose position (assuming frontal is z=0)
        # As person turns sideways, z value increases
        # Max rotation considered is 90 degrees (pi/2)
        rotation_factor = 1 / max(abs(nose.z), 0.1)  # Prevent division by zero
        rotation_factor = min(rotation_factor, 2.0)  # Cap the adjustment factor
        print(rotation_factor)
        
        # Apply rotation compensation to measurements
        chest_width *= rotation_factor
        waist_width *= rotation_factor
    print(chest_width, waist_width)
    
    # Simple size mapping based on chest width (you'll need to calibrate these values)
    # Combined size determination using both chest and waist measurements
    # Determine shirt size based on chest width
    if chest_width < 80:
        shirt_size = "XXS"
    elif chest_width < 90:
        shirt_size = "XS"
    elif chest_width < 100:
        shirt_size = "S"
    elif chest_width < 120:
        shirt_size = "M"
    elif chest_width < 140:
        shirt_size = "L"
    elif chest_width < 160:
        shirt_size = "XL"
    else:
        shirt_size = "XXL"

    # Determine pants size based on waist width
    if waist_width < 70:
        pants_size = "XXS"
    elif waist_width < 80:
        pants_size = "XS"
    elif waist_width < 90:
        pants_size = "S"
    elif waist_width < 110:
        pants_size = "M"
    elif waist_width < 130:
        pants_size = "L"
    elif waist_width < 150:
        pants_size = "XL"
    else:
        pants_size = "XXL"
        
    return {"shirt_size": shirt_size, "pants_size": pants_size}

@router.post("/predict-size-metrics/")
async def predict_size_metrics(data: dict):
    height = data.get('height')  # in cm
    weight = data.get('weight')  # in kg
    age = data.get('age')

    if not all([height, weight, age]):
        return {"error": "Missing required parameters"}
    
    input_data = pd.DataFrame({
        'weight': [weight],
        'age': [age],
        'height': [height]
    }, index=[0])[model['feature_names']]

    prediction = model['model'].predict(input_data)
    
    size_code = {
        1: 'XXS',
        2: 'S',
        3: 'M',
        4: 'L',
        5: 'XL',
        6: 'XXL',
        7: 'XXXL',
    }
    predicted_size = prediction[0]
    size_result = []

    # For values very close to the next size (within 0.2)
    if predicted_size % 1 >= 0.8:
        size_result.append(size_code[int(predicted_size) + 1])
    # For middle values (between 0.4 and 0.7)
    elif predicted_size % 1 >= 0.4:
        size_result.append(size_code[int(predicted_size)])
        size_result.append(size_code[int(predicted_size) + 1])
    else:
        size_result.append(size_code[int(predicted_size)])

    return {"predicted_size": size_result}
