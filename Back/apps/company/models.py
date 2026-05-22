from django.conf import settings
from django.db import models


class Company(models.Model):
    """Модель компании"""
    name = models.CharField('Название', max_length=200)
    description = models.TextField('Описание', blank=True)
    logo = models.ImageField('Логотип', upload_to='logos/', blank=True, null=True)
    website = models.URLField('Сайт', blank=True)
    founded_date = models.DateField('Дата основания', null=True, blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Компания'
        verbose_name_plural = 'Компании'

    def __str__(self):
        return self.name


class Department(models.Model):
    """Модель отдела компании"""
    name = models.CharField('Название', max_length=200)
    company = models.ForeignKey(
        Company,
        verbose_name='Компания',
        on_delete=models.CASCADE,
        related_name='departments',
    )
    description = models.TextField('Описание', blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Отдел'
        verbose_name_plural = 'Отделы'
        ordering = ['name']
        unique_together = ['name', 'company']

    def __str__(self):
        return f'{self.name} ({self.company.name})'


class OrganizationPhoto(models.Model):
    """Фото организации для фотогалереи"""

    image = models.ImageField('Фото', upload_to='organization/gallery/')
    title = models.CharField('Название', max_length=200, blank=True)
    uploaded_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name='Загрузил',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='uploaded_organization_photos',
    )
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Фото организации'
        verbose_name_plural = 'Фото организации'
        ordering = ['-created_at']

    def __str__(self):
        return self.title or f'Фото #{self.pk}'
