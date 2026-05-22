from rest_framework import generics, permissions
from rest_framework.response import Response

from .models import OrganizationPhoto
from .serializers import OrganizationPhotoSerializer, OrganizationPhotoUpdateSerializer


class GalleryListCreateView(generics.ListCreateAPIView):
    """Список фото галереи и загрузка нового фото"""

    serializer_class = OrganizationPhotoSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return OrganizationPhoto.objects.select_related('uploaded_by').all()


class GalleryDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Просмотр, обновление подписи (title) и удаление фото"""

    permission_classes = [permissions.IsAuthenticated]
    queryset = OrganizationPhoto.objects.select_related('uploaded_by').all()

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return OrganizationPhotoUpdateSerializer
        return OrganizationPhotoSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(
            OrganizationPhotoSerializer(instance, context={'request': request}).data
        )
