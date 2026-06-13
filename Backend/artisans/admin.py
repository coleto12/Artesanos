from django.contrib import admin
from .models import ArtisanProfile, CulturalStory, ArtisanReview

@admin.register(ArtisanProfile)
class ArtisanProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'region', 'specialty', 'is_verified')
    list_filter = ('is_verified',)

@admin.register(CulturalStory)
class CulturalStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'artisan', 'created_at')

@admin.register(ArtisanReview)
class ArtisanReviewAdmin(admin.ModelAdmin):
    list_display = ('artisan', 'customer', 'rating', 'created_at')