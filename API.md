# TurboWelcome — API Reference (Frontend)

Документация REST API для фронтенд-разработки.  
Базовый URL (локально): `http://localhost:8000`

> При добавлении новых эндпоинтов на backend этот файл **обязательно** обновляется — см. `.cursorrules`.

---

## Общие сведения

| Параметр | Значение |
|----------|----------|
| Префикс API | `/api/v1/` |
| Формат данных | `application/json` |
| Аутентификация | JWT Bearer Token |
| Пагинация (по умолчанию) | 20 объектов на страницу (для list-эндпоинтов) |
| CORS (dev) | `http://localhost:3000`, `http://127.0.0.1:3000` |

### Заголовки

**Публичные эндпоинты (register, login):**
```http
Content-Type: application/json
```

**Защищённые эндпоинты:**
```http
Content-Type: application/json
Authorization: Bearer <access_token>
```

### JWT-токены

| Токен | Время жизни | Назначение |
|-------|-------------|------------|
| `access` | 1 час | Передаётся в заголовке `Authorization` |
| `refresh` | 7 дней | Обновление access-токена (эндпоинт refresh пока не реализован) |

Формат заголовка: `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

### Роли пользователей

| Значение `role` | Описание |
|-----------------|----------|
| `HR` | HR-менеджер |
| `EMP` | Сотрудник |

### Объект User (общая схема)

Используется в ответах register, login и profile.

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Иван",
  "last_name": "Петров",
  "full_name": "Иван Петров",
  "role": "EMP",
  "phone": "+7 (999) 123-45-67",
  "avatar": null,
  "position": "Junior Developer",
  "hire_date": "2024-12-01",
  "department": 1,
  "department_name": "Департамент разработки",
  "date_joined": "2026-05-21T08:31:29.348220+03:00"
}
```

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | number | ID пользователя |
| `email` | string | Email (уникальный, логин) |
| `first_name` | string | Имя |
| `last_name` | string | Фамилия |
| `full_name` | string | Полное имя (read-only) |
| `role` | `"HR"` \| `"EMP"` | Роль |
| `phone` | string \| null | Телефон |
| `avatar` | string \| null | URL аватара (`/media/avatars/...`) |
| `position` | string | Должность |
| `hire_date` | string \| null | Дата найма (`YYYY-MM-DD`) |
| `department` | number \| null | ID отдела |
| `department_name` | string \| null | Название отдела (read-only) |
| `date_joined` | string | Дата регистрации (ISO 8601, read-only) |

### Объект Tokens

```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Ошибки

DRF возвращает ошибки валидации в формате:

```json
{
  "field_name": ["Текст ошибки"]
}
```

или для общих ошибок:

```json
{
  "non_field_errors": ["Неверный email или пароль"]
}
```

| HTTP-код | Значение |
|----------|----------|
| `200` | Успех |
| `201` | Ресурс создан |
| `400` | Ошибка валидации |
| `401` | Не авторизован (нет/невалидный токен) |
| `403` | Доступ запрещён |
| `404` | Не найдено |

---

## Auth — `/api/v1/auth/`

### POST `/api/v1/auth/register/`

Регистрация нового пользователя. Автоматически возвращает JWT-токены.

| | |
|---|---|
| **Auth** | Не требуется |
| **Content-Type** | `application/json` |

**Request body:**

```json
{
  "email": "new.user@example.com",
  "first_name": "Иван",
  "last_name": "Петров",
  "role": "EMP",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "phone": "+7 (999) 000-00-00",
  "position": "Developer"
}
```

| Поле | Обязательное | Тип | Описание |
|------|:---:|-----|----------|
| `email` | ✅ | string | Email |
| `first_name` | ✅ | string | Имя |
| `last_name` | ✅ | string | Фамилия |
| `role` | ✅ | `"HR"` \| `"EMP"` | Роль |
| `password` | ✅ | string | Пароль (мин. 8 символов) |
| `password_confirm` | ✅ | string | Подтверждение пароля |
| `phone` | ❌ | string | Телефон |
| `position` | ❌ | string | Должность |

**Response `201 Created`:**

```json
{
  "user": { "...": "объект User" },
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

**Пример (axios):**

```javascript
const { data } = await axios.post('/api/v1/auth/register/', {
  email: 'new.user@example.com',
  first_name: 'Иван',
  last_name: 'Петров',
  role: 'EMP',
  password: 'securepass123',
  password_confirm: 'securepass123',
});
// data.user, data.tokens.access, data.tokens.refresh
```

---

### POST `/api/v1/auth/login/`

Вход в систему.

| | |
|---|---|
| **Auth** | Не требуется |
| **Content-Type** | `application/json` |

**Request body:**

```json
{
  "email": "anna.hr@turbowelcome.com",
  "password": "hrpass123"
}
```

| Поле | Обязательное | Тип | Описание |
|------|:---:|-----|----------|
| `email` | ✅ | string | Email |
| `password` | ✅ | string | Пароль |

**Response `200 OK`:**

```json
{
  "user": { "...": "объект User" },
  "tokens": {
    "refresh": "...",
    "access": "..."
  }
}
```

**Response `400 Bad Request`:**

```json
["Неверный email или пароль"]
```

**Тестовые аккаунты (dev):**

| Роль | Email | Пароль |
|------|-------|--------|
| Админ | admin@turbowelcome.com | admin123 |
| HR | anna.hr@turbowelcome.com | hrpass123 |
| Сотрудник | ivan@turbowelcome.com | emppass123 |

**Пример (axios):**

```javascript
const { data } = await axios.post('/api/v1/auth/login/', {
  email: 'anna.hr@turbowelcome.com',
  password: 'hrpass123',
});
localStorage.setItem('accessToken', data.tokens.access);
localStorage.setItem('refreshToken', data.tokens.refresh);
```

---

### GET `/api/v1/auth/me/`

Получить профиль текущего авторизованного пользователя.

| | |
|---|---|
| **Auth** | ✅ Bearer Token |
| **Content-Type** | — |

**Request body:** нет

**Response `200 OK`:**

```json
{
  "id": 2,
  "email": "anna.hr@turbowelcome.com",
  "first_name": "Анна",
  "last_name": "Иванова",
  "full_name": "Анна Иванова",
  "role": "HR",
  "phone": "+7 (999) 123-45-67",
  "avatar": null,
  "position": "HR Business Partner",
  "hire_date": "2023-01-15",
  "department": 2,
  "department_name": "HR отдел",
  "date_joined": "2026-05-21T08:31:29.348220+03:00"
}
```

**Response `401 Unauthorized`:** токен отсутствует или истёк.

**Пример (axios):**

```javascript
const { data } = await axios.get('/api/v1/auth/me/', {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

---

### PATCH `/api/v1/auth/me/`

Обновить профиль текущего пользователя (частичное обновление).

| | |
|---|---|
| **Auth** | ✅ Bearer Token |
| **Content-Type** | `application/json` |

**Request body** (все поля опциональны):

```json
{
  "first_name": "Анна",
  "last_name": "Иванова",
  "phone": "+7 (999) 111-22-33",
  "position": "Senior HR",
  "hire_date": "2023-01-15"
}
```

| Поле | Можно изменить | Тип | Описание |
|------|:---:|-----|----------|
| `first_name` | ✅ | string | Имя |
| `last_name` | ✅ | string | Фамилия |
| `phone` | ✅ | string | Телефон |
| `avatar` | ✅ | file | Аватар (multipart — при загрузке файла) |
| `position` | ✅ | string | Должность |
| `hire_date` | ✅ | string | Дата найма (`YYYY-MM-DD`) |
| `department` | ✅ | number | ID отдела |
| `email` | ❌ | — | Read-only |
| `role` | ❌ | — | Read-only |
| `date_joined` | ❌ | — | Read-only |

**Response `200 OK`:** обновлённый объект User.

**Пример (axios):**

```javascript
const { data } = await axios.patch('/api/v1/auth/me/', {
  phone: '+7 (999) 111-22-33',
  position: 'Senior HR',
}, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

---

## Рекомендации для фронтенда

### Настройка axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Хранение токенов

После `register` или `login` сохраняйте:
- `data.tokens.access` → для запросов к защищённым эндпоинтам
- `data.tokens.refresh` → для будущего обновления access-токена

### Проверка роли на фронте

```javascript
const isHR = user.role === 'HR';
const isEmployee = user.role === 'EMP';
```

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-05-21 | Начальная версия: auth (register, login, me GET/PATCH) |
