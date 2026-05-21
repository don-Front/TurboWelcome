# Настройка локального окружения TurboWelcome Backend

## Установка PostgreSQL

### Windows
1. Скачайте установщик с https://www.postgresql.org/download/windows/
2. Установите, запомнив пароль для пользователя `postgres`
3. Откройте pgAdmin и создайте базу данных:
   - Создать базу: `turbowelcome`
   - Создать пользователя: `turbowelcome_user` с паролем `turbowelcome_pass`
   - Выдать права: GRANT ALL PRIVILEGES ON DATABASE turbowelcome TO turbowelcome_user;

### macOS
```bash
brew install postgresql@16
brew services start postgresql@16
createuser turbowelcome_user -P  # пароль: turbowelcome_pass
createdb turbowelcome -O turbowelcome_user
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install postgresql postgresql-client
sudo -u postgres createuser turbowelcome_user -P
sudo -u postgres createdb turbowelcome -O turbowelcome_user
```

## Запуск проекта

```bash
cd Back
python -m venv .venv
source .venv/bin/activate  # или .venv\Scripts\activate на Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py create_test_data
python manage.py runserver
```

## API Endpoints

- `POST /api/v1/auth/register/` - Регистрация
- `POST /api/v1/auth/login/` - Вход
- `GET /api/v1/auth/me/` - Профиль текущего пользователя
