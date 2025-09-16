from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Certificate
from .utils import *
import tempfile
from pdf2image import convert_from_path
from django.http import FileResponse

class IssueCertificateView(APIView):
    def post(self, request):
        pdf_file = request.FILES.get("pdf")
        if not pdf_file:
            return Response({"error": "PDF file required"}, status=400)

        # Generate cert_id
        cert_id = generate_cert_id()

        # Extract text & compute hash
        text = extract_text_pdf(pdf_file)

        # Reset file pointer so it can be read again
        pdf_file.seek(0)

        hash_value = compute_hash(text)

        # Save in DB
        Certificate.objects.create(cert_id=cert_id, hash_value=hash_value, issuer="Test College")

        # Generate QR
        qr_file = generate_qr(cert_id)

        # Embed QR into PDF
        output_pdf = f"{cert_id}_embedded.pdf"
        embed_qr_in_pdf(pdf_file, qr_file, output_pdf)

        # Return PDF to browser
        return FileResponse(open(output_pdf, "rb"), as_attachment=True, filename=f"{cert_id}_verified.pdf")
    

class VerifyCertificateView(APIView):
    """
    Employer uploads certificate PDF (digital or scanned).
    Backend extracts QR, fetches hash from DB, compares hash.
    """
    def post(self, request):
        pdf_file = request.FILES.get("pdf")
        if not pdf_file:
            return Response({"error": "PDF required"}, status=status.HTTP_400_BAD_REQUEST)

        # Step 1: Extract QR
        cert_id = extract_cert_id_from_pdf(pdf_file)
        if not cert_id:
            return Response({"status": "error", "message": "QR code not found"})

        # Step 2: Lookup hash in DB
        try:
            print(cert_id)
            record = Certificate.objects.get(cert_id=cert_id)
        except Certificate.DoesNotExist:
            return Response({"status": "fake"})

        # Step 3: Extract text
        pdf_file.seek(0)  # Reset pointer before reading
        text = extract_text_pdf(pdf_file)

        if not text.strip():  # scanned PDF
            # Save InMemoryUploadedFile temporarily for pdf2image
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                for chunk in pdf_file.chunks():
                    tmp.write(chunk)
                tmp_path = tmp.name

            images = convert_from_path(tmp_path)
            text = ocr_image(images[0])

        # Step 4: Compute hash
        hash_value = compute_hash(text)

        # Step 5: Compare
        if hash_value == record.hash_value:
            return Response({"status": "valid", "cert_id": cert_id, "issuer": record.issuer})
        else:
            return Response({"status": "fake", "cert_id": cert_id})
