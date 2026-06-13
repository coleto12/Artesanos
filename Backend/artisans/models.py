from django.db import models
from users.models import User

class ArtisanProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='artisan_profile')
    bio = models.TextField(blank=True)
    region = models.CharField(max_length=100, blank=True)
    specialty = models.CharField(max_length=200, blank=True)
    years_of_experience = models.PositiveIntegerField(default=0)
    banner = models.ImageField(upload_to='artisans/banners/', blank=True, null=True)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Perfil de {self.user.username}'

class CulturalStory(models.Model):
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name='stories')
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to='stories/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class ArtisanReview(models.Model):
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE, related_name='reviews')
    customer = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.PositiveIntegerField(default=5)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('artisan', 'customer')

    def __str__(self):
        return f'Reseña de {self.customer.username} a {self.artisan.user.username}'