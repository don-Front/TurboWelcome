from rest_framework import status, generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer,
    DepartmentSerializer,
    NewEmployeeCreateSerializer,
    AdminUserCreateSerializer,
    AdminUserUpdateSerializer,
    NewEmployeeUpdateSerializer,
)
from .permissions import IsAdmin, IsHRManager, IsAdminOrHR

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """Регистрация нового пользователя"""
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


class LoginView(APIView):
    """Вход в систему"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return Response({
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Профиль текущего пользователя"""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return UserProfileUpdateSerializer
        return UserProfileSerializer

    def get_object(self):
        return self.request.user

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(UserProfileSerializer(instance).data)


class AdminUserListView(generics.ListCreateAPIView):
    """Список и создание пользователей (только админ)"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return AdminUserCreateSerializer
        return UserProfileSerializer

    def get_queryset(self):
        return User.objects.select_related('department').order_by('-date_joined')

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserProfileSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class NewEmployeeListView(generics.ListCreateAPIView):
    """Список и создание новых сотрудников (только HR)"""
    permission_classes = [permissions.IsAuthenticated, IsHRManager]

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return NewEmployeeCreateSerializer
        return UserProfileSerializer

    def get_queryset(self):
        return (
            User.objects.filter(role=User.Role.NEW_EMPLOYEE)
            .select_related('department')
            .order_by('-date_joined')
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            UserProfileSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class DepartmentListView(generics.ListAPIView):
    """Список отделов для HR и админа"""
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminOrHR]
    pagination_class = None

    def get_queryset(self):
        from apps.company.models import Department
        return Department.objects.select_related('company').order_by('name')


class AdminUserDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Просмотр, редактирование и удаление пользователя (только админ)"""
    permission_classes = [permissions.IsAuthenticated, IsAdmin]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return AdminUserUpdateSerializer
        return UserProfileSerializer

    def get_queryset(self):
        return User.objects.select_related('department')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(UserProfileSerializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.pk == request.user.pk:
            return Response(
                {'detail': 'Нельзя удалить свой аккаунт'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class NewEmployeeDetailView(generics.RetrieveUpdateDestroyAPIView):
    """Просмотр, редактирование и удаление нового сотрудника (только HR)"""
    permission_classes = [permissions.IsAuthenticated, IsHRManager]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return NewEmployeeUpdateSerializer
        return UserProfileSerializer

    def get_queryset(self):
        return User.objects.filter(role=User.Role.NEW_EMPLOYEE).select_related('department')

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(UserProfileSerializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.pk == request.user.pk:
            return Response(
                {'detail': 'Нельзя удалить свой аккаунт'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
