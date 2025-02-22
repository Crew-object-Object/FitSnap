import io
from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np
from joblib import load
import pandas as pd
from pathlib import Path
import mediapipe as mp
from mediapipe.tasks.python import vision
from PIL import Image
from process import load_seg_model, get_palette, generate_mask

def process_image(image_path, output_path, overlay_path):
    device = 'cpu'
    
    # Initialize and load model
    checkpoint_path = 'models/cloth_segm.pth'
    net = load_seg_model(checkpoint_path, device=device)    
    palette = get_palette(4)
    
    # Process the image
    original_img = Image.open(image_path)
    cloth_seg = generate_mask(original_img, net=net, palette=palette, device=device)
    
    # Save the segmentation mask
    cloth_seg.save(output_path)
    
    # Convert images to numpy arrays for processing
    original_array = np.array(original_img.convert('RGBA'))
    mask_array = np.array(cloth_seg)
    
    # Create a new transparent image
    result_array = np.zeros_like(original_array)
    
    # Copy original image pixels where mask is not black (0)
    mask_bool = mask_array != 0
    result_array[mask_bool] = original_array[mask_bool]
    
    # Create final image
    final_image = Image.fromarray(result_array)
    
    # Save the result
    final_image.save(overlay_path, format='PNG')
    
BaseOptions = mp.tasks.BaseOptions
PoseLandmarker = mp.tasks.vision.PoseLandmarker
PoseLandmarkerOptions = mp.tasks.vision.PoseLandmarkerOptions
VisionRunningMode = mp.tasks.vision.RunningMode

options = PoseLandmarkerOptions(
    base_options=BaseOptions(model_asset_path="models/pose_landmarker_heavy.task"),
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
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)
    results = detector.detect(mp_image)
    
    if results.pose_landmarks[0]:
        nose = results.pose_landmarks[0][0] # Nose is landmark 0
        
        # Calculate angle from nose position (assuming frontal is z=0)
        # As person turns sideways, z value increases
        # Max rotation considered is 90 degrees (pi/2)
        # Get world landmarks for better 3D positioning
        world_landmarks = results.pose_world_landmarks[0]
        
        # Get shoulder landmarks (landmarks 11 and 12 are left and right shoulders)
        left_shoulder = world_landmarks[11]
        right_shoulder = world_landmarks[12]
        nose = world_landmarks[0]
        
        # Calculate shoulder midpoint
        shoulder_mid = type('Point', (), {
            'x': (left_shoulder.x + right_shoulder.x) / 2,
            'y': (left_shoulder.y + right_shoulder.y) / 2,
            'z': (left_shoulder.z + right_shoulder.z) / 2
        })
        
        # Calculate vector from shoulder midpoint to nose
        nose_vector = type('Vector', (), {
            'x': nose.x - shoulder_mid.x,
            'y': nose.y - shoulder_mid.y,
            'z': nose.z - shoulder_mid.z
        })
        
        # Calculate rotation angle in XZ plane (yaw)
        rotation_angle = abs(np.arctan2(nose_vector.z, nose_vector.x))
        rotation_factor = 1 / np.cos(rotation_angle)  # gives 1 for front view, more for side views
        rotation_factor = min(rotation_factor, 2.0)  # Limit the maximum factor to 2.0
        print(f"Rotation angle: {np.degrees(rotation_angle)}, Factor: {rotation_factor}")
        
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
    
    # Set paths for output files
    output_path = "output/segmented.png"
    overlay_path = "output/overlay.png"
    temp_input = "output/input.png"

    # Convert MediaPipe image to numpy array, then to PIL Image
    image_array = mp_image.numpy_view()
    pil_image = Image.fromarray(image_array)
    
    # Save temporary file
    pil_image.save(temp_input)
    
    # Process the image and save results
    try:
        process_image(temp_input, output_path, overlay_path)
    except Exception as e:
        print(f"Error processing image: {e}")
        return {"error": "Failed to process image"}

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
