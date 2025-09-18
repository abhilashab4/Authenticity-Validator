import cv2
import numpy as np

def detect_document(image):
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edged = cv2.Canny(blurred, 75, 200)

    contours, _ = cv2.findContours(edged.copy(), cv2.RETR_LIST, cv2.CHAIN_APPROX_SIMPLE)
    contours = sorted(contours, key=cv2.contourArea, reverse=True)[:5]

    for c in contours:
        peri = cv2.arcLength(c, True)
        approx = cv2.approxPolyDP(c, 0.02 * peri, True)
        if len(approx) == 4:
            return approx
    return None

def preprocess_image(image):
    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply light CLAHE for subtle contrast boost
    clahe = cv2.createCLAHE(clipLimit=1.0, tileGridSize=(8, 8))
    contrast = clahe.apply(gray)

    # Gentle gamma correction to brighten shadows
    gamma = 1.1
    lut = np.array([((i / 255.0) ** (1.0 / gamma)) * 255 for i in range(256)]).astype("uint8")
    brightened = cv2.LUT(contrast, lut)

    # Use bilateral filter to reduce background noise while preserving ink edges
    smooth = cv2.bilateralFilter(brightened, d=5, sigmaColor=40, sigmaSpace=40)

    # Optional: slight sharpening to enhance strokes
    kernel = np.array([[0, -1, 0],
                       [-1, 5, -1],
                       [0, -1, 0]])
    sharpened = cv2.filter2D(smooth, -1, kernel)

    # Convert back to RGB for EasyOCR
    final = cv2.cvtColor(sharpened, cv2.COLOR_GRAY2RGB)
    return final
