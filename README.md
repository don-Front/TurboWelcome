# TurboWelcome

Монорепозиторий: Django (`Back`) + React CRA (`Front`).

## Структура

- **Back** — проект Django (`manage.py`, пакет `turbowelcome`).
- **Front** — React-приложение (Create React App).

## Локальный запуск (кратко)

```bash
cd Back
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python manage.py runserver
```

```bash
cd Front
npm install
npm start
```

## Ветки

- **main** — базовая ветка.
- **Web** / **Mobile** — под разработку платформенных клиентов.
