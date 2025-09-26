from django.urls import path
from .views import IssueCertificateView, VerifyCertificateView, DownloadZipView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('issue/', IssueCertificateView.as_view(), name='issue_certificate'),
    path('verify/', VerifyCertificateView.as_view(), name='verify_certificate'),
    path('download-qrcodes/', DownloadZipView.as_view(), name='download-qrcodes'),
]
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)