import mediapipe as mp
import cv2
import numpy as np

mp_selfie_segmentation = mp.solutions.selfie_segmentation
segmenter = mp_selfie_segmentation.SelfieSegmentation(model_selection=1)

def segment_body_mediapipe(image):
    image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    results = segmenter.process(image_rgb)
    mask = results.segmentation_mask > 0.5  # Thresholding
    return (mask.astype(np.uint8) * 255)
