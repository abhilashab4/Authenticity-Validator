import os
import io
import zipfile
import tempfile
import shutil
import time
import mimetypes
from PIL import Image
from django.http import JsonResponse, FileResponse
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from pdf2image import convert_from_path

from .models import Certificate
from .utils import (
    extract_text_pdf, compute_hash, generate_cert_id, generate_qr,
    embed_qr_in_pdf, extract_cert_id_from_pdf, ocr_image
)


class IssueCertificateView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("files")
        institution_name = request.data.get("institutionName")

        if not uploaded_file:
            return JsonResponse({"error": "File required"}, status=400)

        with tempfile.TemporaryDirectory() as tmpdir:
            output_zip_path = os.path.join(tmpdir, "certificates_with_qr.zip")

            if zipfile.is_zipfile(uploaded_file):
                # Handle ZIP input
                with zipfile.ZipFile(output_zip_path, "w") as out_zip:
                    with tempfile.TemporaryDirectory() as tmpzipdir:
                        zip_path = os.path.join(tmpzipdir, "input.zip")
                        with open(zip_path, "wb") as f:
                            for chunk in uploaded_file.chunks():
                                f.write(chunk)

                        with zipfile.ZipFile(zip_path, "r") as zf:
                            has_new = False
                            for filename in zf.namelist():
                                if not filename.lower().endswith(".pdf"):
                                    continue
                                pdf_bytes = zf.read(filename)
                                pdf_path = os.path.join(tmpzipdir, filename)
                                with open(pdf_path, "wb") as f:
                                    f.write(pdf_bytes)

                                with open(pdf_path, "rb") as pdf_file:
                                    cert_id = generate_cert_id()

                                    qr_file = generate_qr(cert_id)
                                    name, ext = os.path.splitext(filename)
                                    output_pdf = os.path.join(tmpzipdir, f"{name}_embedded{ext}")
                                    embed_qr_in_pdf(pdf_file, qr_file, output_pdf)

                                    with open(output_pdf, "rb") as emb_file:
                                        emb_text = extract_text_pdf(emb_file)
                                        if not emb_text.strip():
                                            emb_file.seek(0)
                                            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                                                tmp.write(emb_file.read())
                                                tmp_path = tmp.name
                                            try:
                                                print(f"Issuing: File {filename}, Doing OCR on embedded")
                                                images = convert_from_path(tmp_path)
                                                emb_text = ocr_image(images[0])
                                                print(f"Issuing: File {filename}, OCR text length: {len(emb_text)}, text: {repr(emb_text[:100])}")
                                            except Exception as e:
                                                print(f"Issuing: File {filename}, OCR failed: {e}")
                                                emb_text = ""
                                            finally:
                                                os.unlink(tmp_path)

                                    hash_value = compute_hash(emb_text)
                                    print(f"Issuing: File {filename}, cert_id: {cert_id}, hash: {hash_value}, final text length: {len(emb_text)}")
                                    Certificate.objects.create(
                                        cert_id=cert_id,
                                        hash_value=hash_value,
                                        issuer=institution_name or "Test College"
                                    )

                                    out_zip.write(output_pdf, os.path.basename(output_pdf))
                                    has_new = True
            else:
                # Handle single PDF or image
                mime = mimetypes.guess_type(uploaded_file.name)[0]
                if mime and mime.startswith('image/'):
                    # Convert image to PDF
                    img = Image.open(uploaded_file)
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    pdf_path = os.path.join(tmpdir, uploaded_file.name + '.pdf')
                    img.save(pdf_path, 'PDF')
                else:
                    pdf_path = os.path.join(tmpdir, uploaded_file.name)
                    with open(pdf_path, "wb") as f:
                        for chunk in uploaded_file.chunks():
                            f.write(chunk)

                with open(pdf_path, "rb") as pdf_file:
                    cert_id = generate_cert_id()

                    qr_file = generate_qr(cert_id)
                    # For images converted to PDF, ensure output is also PDF
                    if mime and mime.startswith('image/'):
                        name = os.path.splitext(uploaded_file.name)[0]
                        output_pdf_path = os.path.join(tmpdir, f"{name}_embedded.pdf")
                    else:
                        name, ext = os.path.splitext(uploaded_file.name)
                        output_pdf_path = os.path.join(tmpdir, f"{name}_embedded{ext}")
                    embed_qr_in_pdf(pdf_file, qr_file, output_pdf_path)

                    with open(output_pdf_path, "rb") as emb_file:
                        emb_text = extract_text_pdf(emb_file)
                        if not emb_text.strip():
                            emb_file.seek(0)
                            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                                tmp.write(emb_file.read())
                                tmp_path = tmp.name
                            try:
                                print(f"Issuing: File {uploaded_file.name}, Doing OCR on embedded")
                                images = convert_from_path(tmp_path)
                                emb_text = ocr_image(images[0])
                                print(f"Issuing: File {uploaded_file.name}, OCR text length: {len(emb_text)}, text: {repr(emb_text[:100])}")
                            except Exception as e:
                                print(f"Issuing: File {uploaded_file.name}, OCR failed: {e}")
                                emb_text = ""
                            finally:
                                os.unlink(tmp_path)

                    hash_value = compute_hash(emb_text)
                    print(f"Issuing: File {uploaded_file.name}, cert_id: {cert_id}, hash: {hash_value}, final text length: {len(emb_text)}")
                    Certificate.objects.create(
                        cert_id=cert_id,
                        hash_value=hash_value,
                        issuer=institution_name or "Test College"
                    )

                # Convert single PDF to zip for consistent download
                with zipfile.ZipFile(output_zip_path, "w") as out_zip:
                    out_zip.write(output_pdf_path, os.path.basename(output_pdf_path))

            # Always replace the same ZIP file to force new content
            final_path = os.path.join(settings.MEDIA_ROOT, "certificates_with_qr.zip")
            os.makedirs(os.path.dirname(final_path), exist_ok=True)
            
            # Remove old file if exists
            if os.path.exists(final_path):
                os.remove(final_path)
            
            shutil.move(output_zip_path, final_path)

            download_url = request.build_absolute_uri(settings.MEDIA_URL + "certificates_with_qr.zip")
            return JsonResponse({
                "status": "ok",
                "message": "Certificates generated successfully!",
                "download_url": download_url
            })


class DownloadZipView(APIView):
    def get(self, request):
        zip_path = os.path.join(settings.MEDIA_ROOT, "certificates_with_qr.zip")
        if os.path.exists(zip_path):
            response = FileResponse(open(zip_path, 'rb'), content_type='application/zip')
            response['Content-Disposition'] = 'attachment; filename="certificates_with_qr.zip"'
            
            # Delete the file after serving
            def cleanup():
                try:
                    os.remove(zip_path)
                    print(f"Deleted ZIP file: {zip_path}")
                except:
                    pass
            
            # Schedule cleanup after response
            import threading
            threading.Timer(1.0, cleanup).start()
            
            return response
        else:
            return JsonResponse({"error": "File not found"}, status=404)


class VerifyCertificateView(APIView):
    def post(self, request):
        uploaded_file = request.FILES.get("files")
        if not uploaded_file:
            return JsonResponse({"error": "File required"}, status=400)

        results = []
        file_bytes = uploaded_file.read()

        try:
            zip_bytes = io.BytesIO(file_bytes)
            if zipfile.is_zipfile(zip_bytes):
                with zipfile.ZipFile(zip_bytes, "r") as zf:
                    for filename in zf.namelist():
                        if not filename.lower().endswith(".pdf"):
                            continue
                        pdf_bytes = zf.read(filename)
                        result = self._process_pdf(pdf_bytes, filename)
                        results.append(result)
                return JsonResponse({"results": results}, safe=False)
        except zipfile.BadZipFile:
            pass

        result = self._process_pdf(file_bytes, uploaded_file.name)
        return JsonResponse({"results": [result]}, safe=False)

    def _process_pdf(self, pdf_bytes, filename):
        pdf_stream = io.BytesIO(pdf_bytes)
        cert_id = extract_cert_id_from_pdf(pdf_stream)
        print(f"File: {filename}, cert_id: {cert_id}")

        if not cert_id:
            return {"file": filename, "status": "error", "message": "QR code not found"}

        try:
            record = Certificate.objects.get(cert_id=cert_id)
        except Certificate.DoesNotExist:
            return {"file": filename, "status": "fake", "cert_id": cert_id}

        pdf_stream.seek(0)
        text = extract_text_pdf(pdf_stream)
        print(f"File: {filename}, Extracted text length: {len(text)}, text: {repr(text[:100])}")

        if not text.strip():
            with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
                tmp.write(pdf_bytes)
                tmp_path = tmp.name
            try:
                print(f"File: {filename}, Doing OCR")
                images = convert_from_path(tmp_path)
                text = ocr_image(images[0])
                print(f"File: {filename}, OCR text length: {len(text)}, text: {repr(text[:100])}")
            except Exception as e:
                print(f"File: {filename}, OCR failed: {e}")
                return {"file": filename, "status": "error", "message": "Unable to process scanned PDF"}
            finally:
                os.unlink(tmp_path)

        hash_value = compute_hash(text)
        if hash_value == record.hash_value:
            return {"file": filename, "status": "valid", "cert_id": cert_id, "issuer": record.issuer}
        else:
            return {"file": filename, "status": "fake", "cert_id": cert_id}
