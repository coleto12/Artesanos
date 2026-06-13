from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import hashlib

WOMPI_INTEGRITY_SECRET = 'test_integrity_qeFlk7INmx1XB1a2d5SmDNZgq4UAnpxC'

@api_view(['POST'])
@permission_classes([AllowAny])
def generate_signature(request):
    reference = request.data.get('reference')
    amount = request.data.get('amount')
    currency = request.data.get('currency', 'COP')
    
    cadena = f"{reference}{str(amount)}{currency}{WOMPI_INTEGRITY_SECRET}"
    print(f"CADENA: {cadena}")  # ← agrega esto
    signature = hashlib.sha256(cadena.encode()).hexdigest()
    print(f"FIRMA: {signature}")  # ← y esto
    
    return Response({'signature': signature})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
    path('api/artisans/', include('artisans.urls')),
    path('api/favorites/', include('favorites.urls')),
    path('api/signature/', generate_signature),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)