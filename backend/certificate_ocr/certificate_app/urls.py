from django.urls import path
from .views import upload_certificate

urlpatterns = [
    path('upload-certificate/', upload_certificate, name='upload_certificate'),
]
