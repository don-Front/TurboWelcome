from django.core.management.base import BaseCommand
from apps.users.models import User
from apps.company.models import Company, Department
from apps.onboarding.models import OnboardingProgram, OnboardingStep, EmployeeOnboarding, StepProgress
from datetime import date


class Command(BaseCommand):
    help = 'Создание тестовых данных для разработки'

    def handle(self, *args, **options):
        self.stdout.write('Создаю тестовые данные...')

        StepProgress.objects.all().delete()
        EmployeeOnboarding.objects.all().delete()
        OnboardingStep.objects.all().delete()
        OnboardingProgram.objects.all().delete()
        Department.objects.all().delete()
        Company.objects.all().delete()
        User.objects.filter(is_superuser=False).delete()

        if not User.objects.filter(email='admin@turbowelcome.com').exists():
            User.objects.create_superuser(
                email='admin@turbowelcome.com',
                password='admin123',
                first_name='Админ',
                last_name='Системы',
                role=User.Role.HR_MANAGER,
            )
            self.stdout.write(self.style.SUCCESS('✓ Суперпользователь создан'))

        hr_user, created = User.objects.get_or_create(
            email='anna.hr@turbowelcome.com',
            defaults={
                'first_name': 'Анна',
                'last_name': 'Иванова',
                'role': User.Role.HR_MANAGER,
                'phone': '+7 (999) 123-45-67',
                'position': 'HR Business Partner',
                'hire_date': date(2023, 1, 15),
            }
        )
        if created:
            hr_user.set_password('hrpass123')
            hr_user.save()
            self.stdout.write(self.style.SUCCESS('✓ HR-менеджер создан'))

        employee, created = User.objects.get_or_create(
            email='ivan@turbowelcome.com',
            defaults={
                'first_name': 'Иван',
                'last_name': 'Петров',
                'role': User.Role.EMPLOYEE,
                'phone': '+7 (999) 987-65-43',
                'position': 'Junior Developer',
                'hire_date': date(2024, 12, 1),
            }
        )
        if created:
            employee.set_password('emppass123')
            employee.save()
            self.stdout.write(self.style.SUCCESS('✓ Сотрудник создан'))

        company, _ = Company.objects.get_or_create(
            name='TurboTech',
            defaults={
                'description': 'Инновационная IT-компания, разрабатывающая решения для автоматизации бизнеса',
                'website': 'https://turbotech.example.com',
                'founded_date': date(2020, 3, 15),
            }
        )
        self.stdout.write(self.style.SUCCESS('✓ Компания создана'))

        it_dept, _ = Department.objects.get_or_create(
            name='Департамент разработки',
            company=company,
            defaults={'description': 'Разработка и поддержка программных продуктов'}
        )

        hr_dept, _ = Department.objects.get_or_create(
            name='HR отдел',
            company=company,
            defaults={'description': 'Управление персоналом и подбор сотрудников'}
        )

        Department.objects.get_or_create(
            name='Маркетинг',
            company=company,
            defaults={'description': 'Продвижение продуктов и услуг'}
        )
        self.stdout.write(self.style.SUCCESS('✓ Отделы созданы'))

        hr_user.department = hr_dept
        hr_user.save()

        employee.department = it_dept
        employee.save()

        program, _ = OnboardingProgram.objects.get_or_create(
            title='Базовая адаптация нового сотрудника',
            defaults={
                'description': 'Программа знакомства с компанией, командой и процессами',
                'created_by': hr_user,
                'is_active': True,
            }
        )
        self.stdout.write(self.style.SUCCESS('✓ Программа адаптации создана'))

        steps_data = [
            {
                'title': 'Знакомство с компанией',
                'description': 'Узнайте историю компании, миссию и ценности',
                'content_type': 'TEXT',
                'content': {
                    'text': 'TurboTech основана в 2020 году...',
                    'links': ['https://turbotech.example.com/about'],
                },
                'order': 1,
                'estimated_days': 1,
            },
            {
                'title': 'Оформление документов',
                'description': 'Подпишите необходимые документы для начала работы',
                'content_type': 'TASK',
                'content': {
                    'tasks': [
                        'Подписать трудовой договор',
                        'Ознакомиться с правилами внутреннего распорядка',
                        'Подписать NDA',
                    ]
                },
                'order': 2,
                'estimated_days': 2,
            },
            {
                'title': 'Знакомство с командой',
                'description': 'Познакомьтесь с коллегами и руководителем',
                'content_type': 'TEXT',
                'content': {
                    'team_members': [
                        {'name': 'Анна Иванова', 'role': 'HR Business Partner'},
                        {'name': 'Иван Петров', 'role': 'Junior Developer'},
                    ]
                },
                'order': 3,
                'estimated_days': 1,
            },
            {
                'title': 'Настройка рабочего окружения',
                'description': 'Установите необходимые инструменты для работы',
                'content_type': 'TASK',
                'content': {
                    'tasks': [
                        'Установить IDE',
                        'Настроить доступ к Git репозиториям',
                        'Установить Docker',
                        'Настроить VPN',
                    ]
                },
                'order': 4,
                'estimated_days': 2,
            },
            {
                'title': 'Первый проект',
                'description': 'Выполните первое тестовое задание в команде',
                'content_type': 'QUIZ',
                'content': {
                    'questions': [
                        {
                            'question': 'Какой методологией разработки мы пользуемся?',
                            'options': ['Scrum', 'Kanban', 'Waterfall'],
                            'correct': 0,
                        }
                    ]
                },
                'order': 5,
                'estimated_days': 3,
            },
        ]

        for step_data in steps_data:
            OnboardingStep.objects.get_or_create(
                program=program,
                title=step_data['title'],
                defaults=step_data,
            )
        self.stdout.write(self.style.SUCCESS('✓ Шаги адаптации созданы'))

        employee_onboarding, created = EmployeeOnboarding.objects.get_or_create(
            employee=employee,
            program=program,
            defaults={
                'assigned_by': hr_user,
                'status': EmployeeOnboarding.Status.IN_PROGRESS,
                'start_date': date.today(),
            }
        )

        if created:
            for step in program.steps.all():
                StepProgress.objects.create(
                    employee_onboarding=employee_onboarding,
                    step=step,
                    status=StepProgress.Status.NOT_STARTED,
                )
            self.stdout.write(self.style.SUCCESS('✓ Адаптация назначена сотруднику'))

        self.stdout.write(self.style.SUCCESS('\n✅ Все тестовые данные созданы успешно!'))
        self.stdout.write('\nДанные для входа:')
        self.stdout.write('  Админ: admin@turbowelcome.com / admin123')
        self.stdout.write('  HR: anna.hr@turbowelcome.com / hrpass123')
        self.stdout.write('  Сотрудник: ivan@turbowelcome.com / emppass123')
