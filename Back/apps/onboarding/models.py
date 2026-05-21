from django.db import models
from django.conf import settings


class OnboardingProgram(models.Model):
    """Программа адаптации"""
    title = models.CharField('Название', max_length=300)
    description = models.TextField('Описание', blank=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name='Создатель',
        on_delete=models.CASCADE,
        related_name='created_programs',
        limit_choices_to={'role__in': ['HR', 'ADM', 'MGR']},
    )
    is_active = models.BooleanField('Активна', default=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)
    updated_at = models.DateTimeField('Обновлено', auto_now=True)

    class Meta:
        verbose_name = 'Программа адаптации'
        verbose_name_plural = 'Программы адаптации'
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class OnboardingStep(models.Model):
    """Шаг программы адаптации"""
    class ContentType(models.TextChoices):
        TEXT = 'TEXT', 'Текст'
        VIDEO = 'VIDEO', 'Видео'
        QUIZ = 'QUIZ', 'Тест'
        TASK = 'TASK', 'Задание'

    program = models.ForeignKey(
        OnboardingProgram,
        verbose_name='Программа',
        on_delete=models.CASCADE,
        related_name='steps',
    )
    title = models.CharField('Название шага', max_length=300)
    description = models.TextField('Описание', blank=True)
    content_type = models.CharField(
        'Тип контента',
        max_length=10,
        choices=ContentType.choices,
        default=ContentType.TEXT,
    )
    content = models.JSONField('Содержание', default=dict)
    order = models.PositiveIntegerField('Порядок', default=0)
    estimated_days = models.PositiveIntegerField('Дней на выполнение', default=1)
    is_required = models.BooleanField('Обязательный', default=True)

    class Meta:
        verbose_name = 'Шаг адаптации'
        verbose_name_plural = 'Шаги адаптации'
        ordering = ['program', 'order']
        unique_together = ['program', 'order']

    def __str__(self):
        return f'{self.program.title} - Шаг {self.order}: {self.title}'


class EmployeeOnboarding(models.Model):
    """Назначенная программа адаптации сотруднику"""
    class Status(models.TextChoices):
        IN_PROGRESS = 'IN_PROGRESS', 'В процессе'
        COMPLETED = 'COMPLETED', 'Завершено'
        CANCELLED = 'CANCELLED', 'Отменено'

    employee = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name='Сотрудник',
        on_delete=models.CASCADE,
        related_name='onboardings',
        limit_choices_to={'role': 'NEW'},
    )
    program = models.ForeignKey(
        OnboardingProgram,
        verbose_name='Программа',
        on_delete=models.CASCADE,
        related_name='employee_onboardings',
    )
    assigned_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        verbose_name='Назначил',
        on_delete=models.SET_NULL,
        null=True,
        related_name='assigned_onboardings',
    )
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=Status.choices,
        default=Status.IN_PROGRESS,
    )
    start_date = models.DateField('Дата начала')
    completed_date = models.DateField('Дата завершения', null=True, blank=True)
    notes = models.TextField('Заметки', blank=True)
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    class Meta:
        verbose_name = 'Адаптация сотрудника'
        verbose_name_plural = 'Адаптации сотрудников'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.employee.get_full_name()} - {self.program.title}'


class StepProgress(models.Model):
    """Прогресс сотрудника по шагу адаптации"""
    class Status(models.TextChoices):
        NOT_STARTED = 'NOT_STARTED', 'Не начато'
        IN_PROGRESS = 'IN_PROGRESS', 'В процессе'
        COMPLETED = 'COMPLETED', 'Выполнено'

    employee_onboarding = models.ForeignKey(
        EmployeeOnboarding,
        verbose_name='Программа адаптации',
        on_delete=models.CASCADE,
        related_name='step_progresses',
    )
    step = models.ForeignKey(
        OnboardingStep,
        verbose_name='Шаг',
        on_delete=models.CASCADE,
        related_name='progresses',
    )
    status = models.CharField(
        'Статус',
        max_length=20,
        choices=Status.choices,
        default=Status.NOT_STARTED,
    )
    notes = models.TextField('Заметки сотрудника', blank=True)
    completed_at = models.DateTimeField('Выполнено', null=True, blank=True)
    started_at = models.DateTimeField('Начато', null=True, blank=True)

    class Meta:
        verbose_name = 'Прогресс по шагу'
        verbose_name_plural = 'Прогресс по шагам'
        unique_together = ['employee_onboarding', 'step']

    def __str__(self):
        return f'{self.employee_onboarding.employee.get_full_name()} - {self.step.title}: {self.get_status_display()}'
