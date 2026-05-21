from rest_framework import serializers
from django.contrib.auth import authenticate
from apps.company.models import Department
from .models import User


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Сериализатор для регистрации пользователя"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        min_length=8,
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'role',
            'password', 'password_confirm', 'phone', 'position',
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'role': {'required': False, 'default': User.Role.NEW_EMPLOYEE},
        }

    def validate_role(self, value):
        if value != User.Role.NEW_EMPLOYEE:
            raise serializers.ValidationError(
                'Самостоятельная регистрация доступна только для роли «Новый сотрудник»'
            )
        return value

    def validate(self, data):
        data.setdefault('role', User.Role.NEW_EMPLOYEE)
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(password=password, **validated_data)
        return user


class UserLoginSerializer(serializers.Serializer):
    """Сериализатор для входа"""
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'})

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if email and password:
            user = authenticate(request=self.context.get('request'), email=email, password=password)
            if not user:
                raise serializers.ValidationError('Неверный email или пароль')
            if not user.is_active:
                raise serializers.ValidationError('Аккаунт деактивирован')
            data['user'] = user
            return data
        raise serializers.ValidationError('Email и пароль обязательны')


class UserProfileSerializer(serializers.ModelSerializer):
    """Сериализатор профиля пользователя"""
    department_name = serializers.CharField(source='department.name', read_only=True)
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'role', 'phone', 'avatar', 'position', 'hire_date',
            'department', 'department_name', 'date_joined',
        ]
        read_only_fields = [
            'id', 'email', 'role', 'avatar', 'hire_date',
            'department', 'date_joined',
        ]

    def get_full_name(self, obj):
        return obj.get_full_name()


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """Сериализатор для обновления личных данных пользователем"""

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'position', 'avatar']

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Имя обязательно')
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Фамилия обязательна')
        return value

    def validate_avatar(self, value):
        max_size = 5 * 1024 * 1024
        if value.size > max_size:
            raise serializers.ValidationError('Размер файла не должен превышать 5 МБ')

        allowed_types = {'image/jpeg', 'image/png', 'image/webp', 'image/gif'}
        if value.content_type not in allowed_types:
            raise serializers.ValidationError('Допустимые форматы: JPG, PNG, WEBP, GIF')

        return value


class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name']


class NewEmployeeCreateSerializer(serializers.ModelSerializer):
    """Создание нового сотрудника HR-менеджером"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'password', 'password_confirm',
            'phone', 'position', 'department', 'hire_date',
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'phone': {'required': False, 'allow_blank': True},
            'position': {'required': False, 'allow_blank': True},
            'department': {'required': False, 'allow_null': True},
            'hire_date': {'required': False, 'allow_null': True},
        }

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Имя обязательно')
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Фамилия обязательна')
        return value

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        validated_data['role'] = User.Role.NEW_EMPLOYEE
        return User.objects.create_user(password=password, **validated_data)


class AdminUserCreateSerializer(serializers.ModelSerializer):
    """Создание пользователя администратором"""
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=8,
        style={'input_type': 'password'},
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'role', 'password', 'password_confirm',
            'phone', 'position', 'department', 'hire_date',
        ]
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'role': {'required': True},
            'phone': {'required': False, 'allow_blank': True},
            'position': {'required': False, 'allow_blank': True},
            'department': {'required': False, 'allow_null': True},
            'hire_date': {'required': False, 'allow_null': True},
        }

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Имя обязательно')
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Фамилия обязательна')
        return value

    def validate_role(self, value):
        allowed = {
            User.Role.ADMIN,
            User.Role.HR_MANAGER,
            User.Role.MANAGER,
            User.Role.NEW_EMPLOYEE,
        }
        if value not in allowed:
            raise serializers.ValidationError('Недопустимая роль')
        return value

    def validate(self, data):
        if data['password'] != data.pop('password_confirm'):
            raise serializers.ValidationError({'password_confirm': 'Пароли не совпадают'})
        return data

    def create(self, validated_data):
        password = validated_data.pop('password')
        return User.objects.create_user(password=password, **validated_data)


class AdminUserUpdateSerializer(serializers.ModelSerializer):
    """Редактирование пользователя администратором"""

    class Meta:
        model = User
        fields = [
            'email', 'first_name', 'last_name', 'role',
            'phone', 'position', 'department', 'hire_date',
        ]
        extra_kwargs = {
            'email': {'required': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'role': {'required': True},
            'phone': {'required': False, 'allow_blank': True},
            'position': {'required': False, 'allow_blank': True},
            'department': {'required': False, 'allow_null': True},
            'hire_date': {'required': False, 'allow_null': True},
        }

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Имя обязательно')
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Фамилия обязательна')
        return value

    def validate_role(self, value):
        allowed = {
            User.Role.ADMIN,
            User.Role.HR_MANAGER,
            User.Role.MANAGER,
            User.Role.NEW_EMPLOYEE,
        }
        if value not in allowed:
            raise serializers.ValidationError('Недопустимая роль')
        return value


class NewEmployeeUpdateSerializer(serializers.ModelSerializer):
    """Редактирование нового сотрудника HR-менеджером"""

    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'phone', 'position', 'department', 'hire_date']
        extra_kwargs = {
            'phone': {'required': False, 'allow_blank': True},
            'position': {'required': False, 'allow_blank': True},
            'department': {'required': False, 'allow_null': True},
            'hire_date': {'required': False, 'allow_null': True},
        }

    def validate_first_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Имя обязательно')
        return value

    def validate_last_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError('Фамилия обязательна')
        return value
