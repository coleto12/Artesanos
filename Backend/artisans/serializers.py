from rest_framework import serializers
from .models import ArtisanProfile, CulturalStory, ArtisanReview

class CulturalStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CulturalStory
        fields = '__all__'
        read_only_fields = ('artisan', 'created_at')

class ArtisanReviewSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(source='customer.username', read_only=True)

    class Meta:
        model = ArtisanReview
        fields = ('id', 'customer_name', 'rating', 'comment', 'created_at')
        read_only_fields = ('customer', 'created_at')

class ArtisanProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.CharField(source='user.email', read_only=True)
    avatar = serializers.ImageField(source='user.avatar', read_only=True)
    user_id = serializers.IntegerField(source='user.id', read_only=True)
    stories = CulturalStorySerializer(many=True, read_only=True)
    reviews = ArtisanReviewSerializer(many=True, read_only=True)
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = ArtisanProfile
        fields = ('id', 'user_id', 'username', 'email', 'avatar', 'bio', 'region', 'specialty',
                  'years_of_experience', 'banner', 'is_verified',
                  'stories', 'reviews', 'average_rating', 'created_at')
        read_only_fields = ('user', 'is_verified', 'created_at')

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance