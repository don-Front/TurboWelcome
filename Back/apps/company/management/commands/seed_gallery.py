from django.core.management.base import BaseCommand

from apps.company.models import OrganizationPhoto


class Command(BaseCommand):
    help = 'Очистка placeholder-фото галереи (загрузка — через API или админку)'

    def handle(self, *args, **options):
        count, _ = OrganizationPhoto.objects.all().delete()
        self.stdout.write(
            self.style.SUCCESS(
                f'Удалено фото из галереи: {count}. '
                'Новые фото загружайте через POST /api/v1/organization/gallery/.'
            )
        )
