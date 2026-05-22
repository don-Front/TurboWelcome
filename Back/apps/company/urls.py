from django.urls import path

from .views import GalleryDetailView, GalleryListCreateView

urlpatterns = [
    path('gallery/', GalleryListCreateView.as_view(), name='organization-gallery'),
    path('gallery/<int:pk>/', GalleryDetailView.as_view(), name='organization-gallery-detail'),
]
