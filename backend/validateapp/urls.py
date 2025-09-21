from django.urls import path
from .views import IssueCertificateView, VerifyCertificateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve

urlpatterns = [
    path('issue/', IssueCertificateView.as_view(), name='issue_certificate'),
    path('verify/', VerifyCertificateView.as_view(), name='verify_certificate'),
        # URL to download QR codes
    path('download-qrcodes/', serve, {
        'document_root': settings.MEDIA_ROOT,
        'path': 'certificates_with_qr.zip',
    }, name='download-qrcodes'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)