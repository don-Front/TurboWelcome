from rest_framework import serializers

from .models import OrganizationPhoto


class OrganizationPhotoSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    uploaded_by_name = serializers.SerializerMethodField()

    class Meta:
        model = OrganizationPhoto
        fields = [
            'id',
            'image',
            'image_url',
            'title',
            'uploaded_by',
            'uploaded_by_name',
            'created_at',
        ]
        read_only_fields = [
            'id',
            'uploaded_by',
            'uploaded_by_name',
            'created_at',
            'image_url',
        ]

    def get_image_url(self, obj):
        if not obj.image:
            return None
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(obj.image.url)
        return obj.image.url

    def get_uploaded_by_name(self, obj):
        if not obj.uploaded_by:
            return None
        return obj.uploaded_by.get_full_name() or obj.uploaded_by.email

    def validate_image(self, value):
        max_size = 10 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('Размер файла не должен превышать 10 МБ')

        allowed_types = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('Допустимые форматы: JPG, PNG, WEBP, GIF')

        return value

    def create(self, validated_data):
        validated_data['uploaded_by'] = self.context['request'].user
        return super().create(validated_data)


class OrganizationPhotoUpdateSerializer(serializers.ModelSerializer):
    """Обновление подписи (title) на обороте карточки"""

    class Meta:
        model = OrganizationPhoto
        fields = ['title']
        extra_kwargs = {
            'title': {'max_length': 200, 'allow_blank': True, 'required': False},
        }
