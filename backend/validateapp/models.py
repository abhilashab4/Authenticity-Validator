from django.db import models

class Certificate(models.Model):
    cert_id = models.CharField(max_length=100, unique=True)
    hash_value = models.CharField(max_length=256)
    issuer = models.CharField(max_length=200)
    issued_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.cert_id} ({self.issuer})"
