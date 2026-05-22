from django.contrib import admin
from .models import Company, Department, OrganizationPhoto


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'website', 'founded_date', 'created_at')
    search_fields = ('name',)


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'company', 'created_at')
    list_filter = ('company',)
    search_fields = ('name',)


@admin.register(OrganizationPhoto)
class OrganizationPhotoAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'uploaded_by', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('title',)
