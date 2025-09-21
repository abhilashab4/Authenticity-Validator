import tempfile
import zipfile
import os
import io
from django.http import FileResponse, JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Certificate
from .utils import (
    extract_text_pdf, compute_hash, generate_cert_id, generate_qr,
    embed_qr_in_pdf, extract_cert_id_from_pdf, ocr_image
)
from pdf2image import convert_from_path
from django.conf import settings

class IssueCertificateView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("files")
        institution_name = request.data.get("institutionName")
        if not uploaded_file:
            return JsonResponse({"error": "File required"}, status=400)

        # Make temp dir to store generated files
        with tempfile.TemporaryDirectory() as tmpdir:
            output_zip_path = os.path.join(tmpdir, "certificates_with_qr.zip")

            if zipfile.is_zipfile(uploaded_file):
                with zipfile.ZipFile(output_zip_path, "w") as out_zip:
                    with tempfile.TemporaryDirectory() as tmpzipdir:
                        zip_path = os.path.join(tmpzipdir, "input.zip")
                        with open(zip_path, "wb") as f:
                            for chunk in uploaded_file.chunks():
                                f.write(chunk)

                        with zipfile.ZipFile(zip_path, "r") as zf:
                            for filename in zf.namelist():
                                if not filename.endswith(".pdf"):
                                    continue
                                pdf_bytes = zf.read(filename)
                                pdf_path = os.path.join(tmpzipdir, filename)
                                with open(pdf_path, "wb") as f:
                                    f.write(pdf_bytes)

                                with open(pdf_path, "rb") as pdf_file:
                                    cert_id = generate_cert_id()
                                    text = extract_text_pdf(pdf_file)
                                    pdf_file.seek(0)
                                    hash_value = compute_hash(text)

                                    Certificate.objects.create(
                                        cert_id=cert_id,
                                        hash_value=hash_value,
                                        issuer=institution_name or "Test College"
                                    )

                                    qr_file = generate_qr(cert_id)
                                    output_pdf = os.path.join(tmpzipdir, f"{cert_id}_embedded.pdf")
                                    embed_qr_in_pdf(pdf_file, qr_file, output_pdf)

                                    out_zip.write(output_pdf, os.path.basename(output_pdf))
            else:
                # Single PDF case
                pdf_path = os.path.join(tmpdir, uploaded_file.name)
                with open(pdf_path, "wb") as f:
                    for chunk in uploaded_file.chunks():
                        f.write(chunk)

                cert_id = generate_cert_id()
                text = extract_text_pdf(open(pdf_path, "rb"))
                hash_value = compute_hash(text)

                Certificate.objects.create(
                    cert_id=cert_id,
                    hash_value=hash_value,
                    issuer=institution_name or "Test College"
                )

                qr_file = generate_qr(cert_id)
                output_pdf_path = os.path.join(tmpdir, f"{cert_id}_verified.pdf")
                with open(pdf_path, "rb") as pdf_file:
                    embed_qr_in_pdf(pdf_file, qr_file, output_pdf_path)

                # Convert single PDF to zip for consistent download
                with zipfile.ZipFile(output_zip_path, "w") as out_zip:
                    out_zip.write(output_pdf_path, os.path.basename(output_pdf_path))

            # Move zip to MEDIA_ROOT or temp static folder for frontend download
            final_path = os.path.join(settings.MEDIA_ROOT, "certificates_with_qr.zip")
            os.makedirs(os.path.dirname(final_path), exist_ok=True)
            os.replace(output_zip_path, final_path)

        download_url = request.build_absolute_uri(settings.MEDIA_URL + "certificates_with_qr.zip")
        return JsonResponse({
            "status": "ok",
            "message": "Certificates generated successfully!",
            "download_url": download_url
        })


class VerifyCertificateView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("zip_or_pdf")
        if not uploaded_file:
            return Response({"error": "File required"}, status=400)

        results = []

        if zipfile.is_zipfile(uploaded_file):
            zip_bytes = io.BytesIO(uploaded_file.read())
            with zipfile.ZipFile(zip_bytes, "r") as zf:
                for filename in zf.namelist():
                    if not filename.endswith(".pdf"):
                        continue
                    pdf_bytes = zf.read(filename)
                    pdf_stream = io.BytesIO(pdf_bytes)

                    cert_id = extract_cert_id_from_pdf(pdf_stream)
                    if not cert_id:
                        results.append({"file": filename, "status": "error", "message": "QR not found"})
                        continue

                    try:
                        record = Certificate.objects.get(cert_id=cert_id)
                    except Certificate.DoesNotExist:
                        results.append({"file": filename, "status": "fake", "cert_id": cert_id})
                        continue

                    pdf_stream.seek(0)
                    text = extract_text_pdf(pdf_stream)

                    if not text.strip():  # scanned PDF
                        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                            tmp.write(pdf_bytes)
                            tmp_path = tmp.name
                        images = convert_from_path(tmp_path)
                        text = ocr_image(images[0])

                    hash_value = compute_hash(text)
                    if hash_value == record.hash_value:
                        results.append({"file": filename, "status": "valid", "cert_id": cert_id, "issuer": record.issuer})
                    else:
                        results.append({"file": filename, "status": "fake", "cert_id": cert_id})

            return JsonResponse({"results": results}, safe=False)


        else:
            pdf_stream = io.BytesIO(uploaded_file.read())
            cert_id = extract_cert_id_from_pdf(pdf_stream)
            if not cert_id:
                return Response({"status": "error", "message": "QR code not found"})

            try:
                record = Certificate.objects.get(cert_id=cert_id)
            except Certificate.DoesNotExist:
                return Response({"status": "fake"})

            pdf_stream.seek(0)
            text = extract_text_pdf(pdf_stream)

            if not text.strip():
                with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                    tmp.write(pdf_stream.getvalue())
                    tmp_path = tmp.name
                images = convert_from_path(tmp_path)
                text = ocr_image(images[0])

            hash_value = compute_hash(text)
            if hash_value == record.hash_value:
                return Response({"status": "valid", "cert_id": cert_id, "issuer": record.issuer})
            else:
                return Response({"status": "fake", "cert_id": cert_id}) 

