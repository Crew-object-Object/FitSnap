import io
from fastapi import APIRouter, UploadFile, File
import cv2
import numpy as np
from joblib import load
from fastapi import Form
import pandas as pd
from pathlib import Path
import mediapipe as mp
from mediapipe.tasks.python import vision
from PIL import Image
from process import load_seg_model, get_palette, generate_mask
import requests
import uuid
from fastapi.responses import FileResponse
from fastapi import HTTPException
from network import U2NET
import torch

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
async def predict_size(file: UploadFile = File(...), fit_url: str = Form(None)):
    # Read the uploaded image
    contents = await file.read()
    with open("uploaded_image.jpg", "wb") as f:
        f.write(contents)
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
    waist_width = (np.sum(mask[waist_height, :]) / 255) / image_width * 300
    
    # Get nose landmark from mediapipe
    detector = vision.PoseLandmarker.create_from_options(options)
    mp_image = mp.Image(image_format=mp.ImageFormat.SRGB, data=image)
    results = detector.detect(mp_image)
    
    if results.pose_landmarks[0]:
        # Get world landmarks for better 3D positioning
        world_landmarks = results.pose_world_landmarks[0]
        
        # Get shoulder landmarks (landmarks 11 and 12 are left and right shoulders)
        left_shoulder = world_landmarks[11]
        right_shoulder = world_landmarks[12]
        
        # Calculate actual 3D distance between shoulders
        shoulder_distance_3d = np.sqrt(
            (right_shoulder.x - left_shoulder.x)**2 +
            (right_shoulder.y - left_shoulder.y)**2 +
            (right_shoulder.z - left_shoulder.z)**2
        )
        
        # Calculate 2D distance (ignoring z-axis)
        shoulder_distance_2d = np.sqrt(
            (right_shoulder.x - left_shoulder.x)**2 +
            (right_shoulder.y - left_shoulder.y)**2
        )
        
        # Calculate rotation factor (2D distance / 3D distance)
        # When person is facing forward, this will be close to 1
        # When turned sideways, this will be smaller
        rotation_factor = min(2.0, 1 / (shoulder_distance_2d / shoulder_distance_3d))
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
    
    # Set paths for output files
    output_path = "output/segmented.png"
    overlay_path = "output/overlay.png"
    fit_path = "output/input.png"

    # Ensure output directory exists
    Path("output").mkdir(exist_ok=True)

    # Convert MediaPipe image to numpy array, then to PIL Image
    # Download image from URL if provided
    if fit_url:
        response = requests.get(fit_url)
        image_array = cv2.imdecode(np.frombuffer(response.content, np.uint8), cv2.IMREAD_COLOR)
    else:
        return {"error": "No fit_url provided"}
    image_array = cv2.cvtColor(image_array, cv2.COLOR_BGR2RGB)
    pil_image = Image.fromarray(image_array)
    
    # Save temporary file
    pil_image.save(fit_path)
    
    # Process the image and save results
    process_image(fit_path, output_path, overlay_path)
    # Get landmarks for fit image
    fit_img = cv2.imread(fit_path, cv2.IMREAD_UNCHANGED)
    fit_mp = mp.Image(image_format=mp.ImageFormat.SRGB, data=cv2.cvtColor(fit_img, cv2.COLOR_BGRA2RGB))
    fit_results = detector.detect(fit_mp)

    # Get original image landmarks again
    original_results = detector.detect(mp_image)

    if (fit_results.pose_landmarks and fit_results.pose_landmarks[0] and 
        original_results.pose_landmarks and original_results.pose_landmarks[0] and 
        len(original_results.pose_landmarks[0]) > 12 and len(fit_results.pose_landmarks[0]) > 12):

        # Get shoulder landmarks from both images
        orig_left = original_results.pose_landmarks[0][11]
        orig_right = original_results.pose_landmarks[0][12]
        overlay_left = fit_results.pose_landmarks[0][11]
        overlay_right = fit_results.pose_landmarks[0][12]

        # Convert normalized landmark positions into pixel coordinates
        orig_img_h, orig_img_w = image.shape[:2]
        orig_left_pt = np.array([orig_left.x * orig_img_w, orig_left.y * orig_img_h])
        orig_right_pt = np.array([orig_right.x * orig_img_w, orig_right.y * orig_img_h])
        orig_mid = (orig_left_pt + orig_right_pt) / 2

        # Load the overlay (fit) image and get dimensions
        overlay_img = cv2.imread(overlay_path, cv2.IMREAD_UNCHANGED)
        if overlay_img is None:
            raise ValueError("Overlay image not found at the provided path.")
        overlay_h, overlay_w = overlay_img.shape[:2]
        overlay_left_pt = np.array([overlay_left.x * overlay_w, overlay_left.y * overlay_h])
        overlay_right_pt = np.array([overlay_right.x * overlay_w, overlay_right.y * overlay_h])
        overlay_mid = (overlay_left_pt + overlay_right_pt) / 2

        # Compute angles (in degrees) for shoulders
        orig_angle = np.degrees(np.arctan2(orig_right_pt[1] - orig_left_pt[1],
                                             orig_right_pt[0] - orig_left_pt[0]))
        overlay_angle = np.degrees(np.arctan2(overlay_right_pt[1] - overlay_left_pt[1],
                                              overlay_right_pt[0] - overlay_left_pt[0]))
        angle_diff = orig_angle - overlay_angle

        # Compute scaling factor based on shoulder distances
        orig_dist = np.hypot(*(orig_right_pt - orig_left_pt))
        overlay_dist = np.hypot(*(overlay_right_pt - overlay_left_pt))
        scale_factor = orig_dist / overlay_dist if overlay_dist != 0 else 1.0

        # Create an affine transform that rotates, scales, and translates the overlay image
        # Use the overlay shoulder midpoint as the center of rotation
        M = cv2.getRotationMatrix2D(tuple(overlay_mid), angle_diff, scale_factor)
        # Adjust translation so that overlay_mid aligns with orig_mid
        M[:, 2] += (orig_mid - overlay_mid)

        # Apply the affine transformation onto a canvas the size of the original image
        canvas = image.copy()
        transformed_overlay = cv2.warpAffine(overlay_img, M, (orig_img_w, orig_img_h),
                                             flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_CONSTANT, borderValue=(0,0,0,0))

        # Composite the transformed overlay onto the original image
        if transformed_overlay.shape[2] == 4:
            # Separate color and alpha channels
            overlay_rgb = transformed_overlay[:, :, :3]
            alpha_mask = transformed_overlay[:, :, 3] / 255.0
            alpha_mask = alpha_mask[..., np.newaxis]
            canvas = (alpha_mask * overlay_rgb + (1 - alpha_mask) * canvas).astype(np.uint8)
        else:
            # If no alpha channel, simple overlay (could be modified to blend if needed)
            canvas = transformed_overlay

        # Generate unique ID for the file
        unique_id = str(uuid.uuid4())
        
        # Save the result image to public folder
        public_folder = "public/images"
        Path(public_folder).mkdir(parents=True, exist_ok=True)
        result_path = f"{public_folder}/{unique_id}.png"
        cv2.imwrite(result_path, canvas)
        
        # Return URL path to the result image
        result_url = f"/public/images/{unique_id}.png"
    
    # Helper function to perform segmentation using U2NET to obtain a binary body mask
    def u2net_segment(image_path):
        # Load the U2NET model (here we create a new instance; in practice, load pre-trained weights)
        model_u2 = U2NET(in_ch=3, out_ch=1)
        model_u2.eval()
        # Open the image with PIL and resize it to the expected input size (here, 320x320 as an example)
        pil_img = Image.open(image_path).convert("RGB")
        pil_img = pil_img.resize((320, 320))
        img_np = np.array(pil_img, dtype=np.float32) / 255.0
        # Convert to tensor and add a batch dimension; change HWC to CHW
        tensor = torch.from_numpy(img_np).permute(2, 0, 1).unsqueeze(0)
        with torch.no_grad():
            # Forward pass: get the mask from the model; use [0] to extract the correct output as in predict_shirt_fit
            mask = model_u2(tensor)[0]
        # Squeeze batch and channel dimensions and threshold the output to get a binary mask
        mask_np = mask.squeeze().cpu().numpy()
        binary_mask = (mask_np > 0.5).astype(np.uint8)
        return binary_mask

    # Compute additional fit predictions using U2NET segmentation proportions
    # Updated U2NET-based shirt fit prediction function
    def predict_shirt_fit(chest, waist, fit_image_path):
        # Obtain segmentation mask using U2NET
        model_u2 = U2NET(in_ch=3, out_ch=1)
        model_u2.eval()
        pil_img = Image.open(fit_image_path).convert("RGB")
        pil_img = pil_img.resize((320, 320))
        img_np = np.array(pil_img, dtype=np.float32) / 255.0
        tensor = torch.from_numpy(img_np).permute(2, 0, 1).unsqueeze(0)
        with torch.no_grad():
            mask = model_u2(tensor)[0]
        mask = mask.squeeze().cpu().numpy()
        mask = (mask > 0.5).astype(np.uint8)
        h, w = mask.shape
        upper_body_area = np.sum(mask[:h//2, :])
        lower_body_area = np.sum(mask[h//2:, :])
        area_ratio = upper_body_area / (lower_body_area + 1e-5)
        
        diff = chest - waist
        if diff > 10:
            base_fit = "loose fit"
        elif diff < 2:
            base_fit = "slim fit"
        else:
            base_fit = "regular fit"
        
        if area_ratio > 1.1:
            return base_fit + " (considering higher upper body proportion)"
        elif area_ratio < 0.9:
            return base_fit + " (considering lower upper body proportion)"
        else:
            return base_fit

    # Updated U2NET-based pants fit prediction function
    def predict_pants_fit(chest, waist, fit_image_path):
        mask = u2net_segment(fit_image_path)
        h, w = mask.shape
        lower_body_area = np.sum(mask[h//2:, :])
        total_area = np.sum(mask)
        lower_body_proportion = lower_body_area / (total_area + 1e-5)
        ratio = waist / chest if chest else 1
        if ratio > 0.95:
            base_fit = "loose fit"
        elif ratio < 0.85:
            base_fit = "slim fit"
        else:
            base_fit = "regular fit"
        
        if lower_body_proportion > 0.55:
            return base_fit + " (considering higher lower body fat)"
        else:
            return base_fit

    shirt_fit = predict_shirt_fit(chest_width, waist_width, fit_path)
    pants_fit = predict_pants_fit(chest_width, waist_width, fit_path)

    return {
        "shirt_size": shirt_size,
        "pants_size": pants_size,
        "shirt_fit": shirt_fit,
        "pants_fit": pants_fit,
        "result_url": result_url
    }

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

@router.get("/public/images/{image}")
async def get_image(image: str):
    image_path = Path("public/images") / image
    if not image_path.exists():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(str(image_path), media_type="image/png")
