from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        CLIENTE = 'cliente', 'Cliente'
        ARTESANO = 'artesano', 'Artesano'
        ADMINISTRADOR = 'administrador', 'Administrador'

    role = models.CharField(
        max_length=20,
        choices=Role.choices,
        default=Role.CLIENTE
    )
    phone = models.CharField(max_length=20, blank=True)
    address = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)

    def __str__(self):
        return f'{self.username} ({self.role})'