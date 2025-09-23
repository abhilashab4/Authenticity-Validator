from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image
import numpy as np
import easyocr
import cv2
import spacy
from spellchecker import SpellChecker
from fuzzywuzzy import fuzz
from .utils import preprocess_image

reader = easyocr.Reader(['en'])
nlp = spacy.load("en_core_web_sm")
spell = SpellChecker()

WHITELIST = {
    "USN", "VTU", "Sahyadri", "Mangaluru", "CERTIFICATE", "Faculty In charge",
    "Head of Department", "Branch", "Semester", "Marks", "Completion", "Overview",
    "Internship", "Project", "Training", "Subject", "Course", "Management", "Date",
    "Name", "Institution", "Signature", "Engineering", "Autonomous", "College"
}

FIELD_LABELS = [
    "Name:", "Date:", "Institution", "Branch/Section", "Faculty In charge", "Marks Awarded",
    "Signature of Faculty", "Head of Department", "USN", "Semester", "Subject"
]

def correct_text(text):
    corrected_words = []
    for word in text.split():
        if word in WHITELIST or word.isupper():
            corrected_words.append(word)
        else:
            corrected = spell.correction(word)
            corrected_words.append(corrected if corrected else word)
    return " ".join(corrected_words)

def fuzzy_replace(text, targets):
    lines = text.split('\n')
    for i, line in enumerate(lines):
        for correct in targets:
            if fuzz.partial_ratio(line.lower(), correct.lower()) > 80:
                lines[i] = correct
    return "\n".join(lines)

def extract_entities(text):
    doc = nlp(text)
    name = None
    date = None
    for ent in doc.ents:
        if ent.label_ == "PERSON" and not name:
            name = ent.text
        elif ent.label_ == "DATE" and not date:
            date = ent.text
    return name, date

def fallback_extraction(text):
    lines = text.split('\n')
    title = None
    for line in lines:
        if any(word in line.lower() for word in ["course", "program", "certified in", "training", "experiments", "overview", "subject"]):
            title = line.strip()
    return title

@csrf_exempt
def upload_certificate(request):
    if request.method == 'POST' and request.FILES.get('file'):
        uploaded_file = request.FILES['file']
        pil_image = Image.open(uploaded_file)
        image = np.array(pil_image)
        image = cv2.cvtColor(image, cv2.COLOR_RGB2BGR)

        processed = preprocess_image(image)

        cv2.imwrite("debug_before.jpg", image)
        cv2.imwrite("debug_after.jpg", processed)

        results = reader.readtext(processed, paragraph=True)
        full_text = " ".join([result[1] for result in results if len(result) >= 2])

        if len(full_text.strip()) < 20:
            return JsonResponse({
                "error": "OCR failed to extract meaningful text",
                "raw_text": full_text
            })

        full_text = correct_text(full_text)
        full_text = fuzzy_replace(full_text, FIELD_LABELS)

        name, date = extract_entities(full_text)
        title = fallback_extraction(full_text)

        extracted = {
            "name": name if name else "Not found",
            "certificate_title": title if title else "Not found",
            "issue_date": date if date else "Not found",
            "full_text": full_text
        }

        return JsonResponse(extracted)

    return JsonResponse({"error": "No file uploaded"}, status=400)
