# Тестовые пользователи TurboWelcome (временный файл)

> **Только для локальной разработки.** Не использовать в production.  
> Удалите этот файл перед деплоем или добавьте в `.gitignore`.

Данные создаются командой:

```bash
cd Back
python manage.py create_test_data
```

Вход через фронтенд: http://localhost:3000  
API login: `POST http://localhost:8000/api/v1/auth/login/`

---

## Учётные записи

| Роль | Код | Email | Пароль | Имя |
|------|-----|-------|--------|-----|
| Админ | `ADM` | admin@turbowelcome.com | admin123 | Админ Системы |
| HR-менеджер | `HR` | anna.hr@turbowelcome.com | hrpass123 | Анна Иванова |
| Руководитель | `MGR` | sergey.mgr@turbowelcome.com | mgrpass123 | Сергей Козлов |
| Новый сотрудник | `NEW` | ivan@turbowelcome.com | emppass123 | Иван Петров |

---

## Дополнительно

| Пользователь | Должность | Отдел |
|--------------|-----------|-------|
| admin@turbowelcome.com | — | — |
| anna.hr@turbowelcome.com | HR Business Partner | HR отдел |
| sergey.mgr@turbowelcome.com | Team Lead | Департамент разработки |
| ivan@turbowelcome.com | Junior Developer | Департамент разработки |

---

## Django Admin

- URL: http://localhost:8000/admin/
- Логин: `admin@turbowelcome.com`
- Пароль: `admin123`

---

## Пример запроса login (curl)

```bash
curl -X POST http://localhost:8000/api/v1/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"anna.hr@turbowelcome.com\", \"password\": \"hrpass123\"}"
```
