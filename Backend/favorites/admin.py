from django.contrib import admin
from .models import FavoriteProduct, FavoriteArtisan

@admin.register(FavoriteProduct)
class FavoriteProductAdmin(admin.ModelAdmin):
    list_display = ('user', 'product', 'created_at')

@admin.register(FavoriteArtisan)
class FavoriteArtisanAdmin(admin.ModelAdmin):
    list_display = ('user', 'artisan', 'created_at')