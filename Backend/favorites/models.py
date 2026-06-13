from django.db import models
from users.models import User
from products.models import Product
from artisans.models import ArtisanProfile

class FavoriteProduct(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_products')
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

class FavoriteArtisan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='favorite_artisans')
    artisan = models.ForeignKey(ArtisanProfile, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'artisan')