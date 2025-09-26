import hashlib
import fitz  
import qrcode
import tempfile
from pdf2image import convert_from_path
import pytesseract
import qrcode
from qrcode.constants import ERROR_CORRECT_H
import uuid
from urllib.parse import urlparse, parse_qs
import cv2
import numpy as np

# Normalize text for consistent hash
def normalize_text(text):
    return "".join(e.lower() for e in text if e.isalnum())

# Compute SHA-256 hash
def compute_hash(text):
    return hashlib.sha256(normalize_text(text).encode()).hexdigest()

# Generate unique certificate ID
def generate_cert_id():
    return str(uuid.uuid4())

# Extract text from digital PDF

import fitz  # PyMuPDF

def extract_text_pdf(pdf_file):
    """
    Extract text from an uploaded PDF file (digital PDF)
    """
    # Read file content into memory
    pdf_bytes = pdf_file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    text = ""
    for page in doc:
        text += page.get_text()
    return text


# Perform OCR on scanned PDF page
def ocr_image(image):
    return pytesseract.image_to_string(image)


def generate_qr(cert_id, filename="qr.png"):
    """
    Generate a QR code for certificate verification URL.

    Args:
        cert_id (str): Unique certificate ID
        filename (str): File path to save the QR code image

    Returns:
        str: Path to the saved QR code image
    """
    # URL that QR code points to
    qr_data = f"{cert_id}"

    # Create QR code object with higher error correction
    qr = qrcode.QRCode(
        version=2,  # controls size of QR code; higher = bigger
        error_correction=ERROR_CORRECT_H,  # High error correction
        box_size=10,  # size of each box in pixels
        border=4,  # thickness of border (default 4)
    )

    qr.add_data(qr_data)
    qr.make(fit=True)

    # Generate the image
    qr_img = qr.make_image(fill_color="black", back_color="white")

    # Save the image
    qr_img.save(filename)

    return filename
import fitz  # PyMuPDF

def embed_qr_in_pdf(pdf_file, qr_file, output_path, qr_size=100):
    """
    Find the largest blank rectangle in the first page of PDF and embed QR code.
    """
    pdf_bytes = pdf_file.read()
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    page = doc[0]
    page_rect = page.rect

    # Collect occupied areas (text + images)
    occupied = []

    # Text blocks
    for block in page.get_text("blocks"):
        occupied.append(fitz.Rect(block[:4]))

    # Images
    for img in page.get_images(full=True):
        xref = img[0]
        for r in page.get_image_rects(xref):
            occupied.append(r)

    # Candidate positions to test (grid scanning)
    step = 20  # granularity, smaller = more accurate but slower
    best_rect = None
    best_area = 0

    for y in range(0, int(page_rect.height - qr_size), step):
        for x in range(0, int(page_rect.width - qr_size), step):
            candidate = fitz.Rect(x, y, x + qr_size, y + qr_size)

            # Check overlap
            if any(candidate.intersects(r) for r in occupied):
                continue

            area = candidate.get_area()
            if area > best_area:
                best_area = area
                best_rect = candidate

    if best_rect:
        page.insert_image(best_rect, filename=qr_file)
    else:
        # fallback: bottom-right
        best_rect = fitz.Rect(
            page_rect.x1 - qr_size - 20,
            page_rect.y1 - qr_size - 20,
            page_rect.x1 - 20,
            page_rect.y1 - 20
        )
        page.insert_image(best_rect, filename=qr_file)

    doc.save(output_path)
    return output_path




import tempfile
import cv2
import numpy as np
from urllib.parse import urlparse, parse_qs
from pdf2image import convert_from_path


def extract_cert_id_from_pdf(pdf_file):
    """
    Extract certificate ID from QR code in uploaded PDF using OpenCV.
    Supports both Django UploadedFile and BytesIO/normal file-like objects.

    Returns: certificate ID string or None if not found
    """
    # Step 1: Save to temporary file (works for both UploadedFile and BytesIO)
    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        if hasattr(pdf_file, "chunks"):  # Django UploadedFile
            for chunk in pdf_file.chunks():
                tmp.write(chunk)
        else:  # BytesIO or file-like
            tmp.write(pdf_file.read())
        tmp_path = tmp.name

    # Step 2: Convert PDF pages to images
    images = convert_from_path(tmp_path)  # add poppler_path if needed

    # Step 3: Initialize OpenCV QRCode detector
    detector = cv2.QRCodeDetector()

    # Step 4: Loop through images and decode QR code
    for pil_image in images:
        cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
        data, points, _ = detector.detectAndDecode(cv_image)
        if data:
            # Step 5: Extract certificate ID from URL or plain text
            parsed_url = urlparse(data)
            query_params = parse_qs(parsed_url.query)
            cert_id = query_params.get("cert_id")  # adjust key based on QR URL
            if cert_id:
                return cert_id[0]
            else:
                return data  # QR contained just the cert_id

    return None
