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
| `ADM` | Админ |
| `HR` | HR-менеджер |
| `MGR` | Руководитель |
| `NEW` | Новый сотрудник |

### Объект User (общая схема)

Используется в ответах register, login и profile.

```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "Иван",
  "last_name": "Петров",
  "full_name": "Иван Петров",
  "role": "NEW",
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
| `role` | `"ADM"` \| `"HR"` \| `"MGR"` \| `"NEW"` | Роль |
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
  "role": "NEW",
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
| `role` | ❌ | `"NEW"` | При самостоятельной регистрации только `NEW` |
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
  role: 'NEW',
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
| Руководитель | sergey.mgr@turbowelcome.com | mgrpass123 |
| Новый сотрудник | ivan@turbowelcome.com | emppass123 |

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
| **Content-Type** | `application/json` или `multipart/form-data` (для загрузки аватара) |

**Request body** (все поля опциональны):

```json
{
  "first_name": "Анна",
  "last_name": "Иванова",
  "phone": "+7 (999) 111-22-33",
  "position": "Senior HR"
}
```

| Поле | Можно изменить | Тип | Описание |
|------|:---:|-----|----------|
| `first_name` | ✅ | string | Имя (обязательно, не пустое) |
| `last_name` | ✅ | string | Фамилия (обязательно, не пустое) |
| `phone` | ✅ | string | Телефон |
| `position` | ✅ | string | Должность |
| `avatar` | ✅ | file | Фото профиля (multipart, JPG/PNG/WEBP/GIF, до 5 МБ) |
| `email` | ❌ | — | Read-only |
| `role` | ❌ | — | Read-only |
| `hire_date` | ❌ | — | Read-only |
| `department` | ❌ | — | Read-only |
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

**Пример загрузки аватара (axios + FormData):**

```javascript
const formData = new FormData();
formData.append('avatar', file);

const { data } = await axios.patch('/api/v1/auth/me/', formData, {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'multipart/form-data',
  },
});
```

---

### GET `/api/v1/auth/users/`

Список всех пользователей системы. Доступен **только админам** (`role: ADM`).

| | |
|---|---|
| **Auth** | ✅ Bearer Token |
| **Роль** | `ADM` |
| **Content-Type** | — |

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | number | Номер страницы (пагинация, 20 записей) |

**Response `200 OK`:**

```json
{
  "count": 4,
  "next": null,
  "previous": null,
  "results": [
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
  ]
}
```

**Response `403 Forbidden`:** пользователь не админ.

**Пример (axios):**

```javascript
const { data } = await axios.get('/api/v1/auth/users/', {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

---

### POST `/api/v1/auth/users/`

Создать пользователя с любой ролью. Доступен **только админам** (`role: ADM`).

| | |
|---|---|
| **Auth** | ✅ Bearer Token |
| **Роль** | `ADM` |
| **Content-Type** | `application/json` |

**Request body:**

```json
{
  "email": "manager@turbowelcome.com",
  "first_name": "Сергей",
  "last_name": "Козлов",
  "role": "MGR",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "phone": "+7 (999) 000-00-00",
  "position": "Team Lead",
  "department": 1,
  "hire_date": "2026-05-21"
}
```

| Поле | Обязательно | Тип | Описание |
|------|:---:|-----|----------|
| `email` | ✅ | string | Email (уникальный) |
| `first_name` | ✅ | string | Имя |
| `last_name` | ✅ | string | Фамилия |
| `role` | ✅ | string | `ADM`, `HR`, `MGR` или `NEW` |
| `password` | ✅ | string | Пароль (мин. 8 символов) |
| `password_confirm` | ✅ | string | Подтверждение пароля |
| `phone` | ❌ | string | Телефон |
| `position` | ❌ | string | Должность |
| `department` | ❌ | number | ID отдела |
| `hire_date` | ❌ | string | Дата найма (`YYYY-MM-DD`) |

**Response `201 Created`:** объект User.

**Response `403 Forbidden`:** пользователь не админ.

---

### PATCH / DELETE `/api/v1/auth/users/{id}/`

Редактирование и удаление пользователя. Доступно **только админам** (`role: ADM`).

| | PATCH | DELETE |
|---|---|---|
| **Auth** | ✅ Bearer Token | ✅ Bearer Token |
| **Роль** | `ADM` | `ADM` |

**PATCH body** (частичное обновление): `email`, `first_name`, `last_name`, `role`, `phone`, `position`, `department`, `hire_date`.

**Response `200 OK`:** обновлённый объект User.

**Response `204 No Content`:** пользователь удалён.

**Response `400 Bad Request`:** нельзя удалить свой аккаунт.

---

### GET `/api/v1/auth/users/new/`

Список новых сотрудников (`role: NEW`). Доступен **только HR-менеджерам** (`role: HR`).

| | |
|---|---|
| **Auth** | ✅ Bearer Token |
| **Роль** | `HR` |
| **Content-Type** | — |

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `page` | number | Номер страницы (пагинация, 20 записей) |

**Response `200 OK`:** тот же формат пагинированного списка, что и у `/users/`, но только пользователи с `role: "NEW"`.

**Response `403 Forbidden`:** пользователь не HR.

**Пример (axios):**

```javascript
const { data } = await axios.get('/api/v1/auth/users/new/', {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

---

### POST `/api/v1/auth/users/new/`

Создать нового сотрудника с ролью `NEW`. Доступен **только HR-менеджерам** (`role: HR`).

| | |
|---|---|
| **Auth** | ✅ Bearer Token |
| **Роль** | `HR` |
| **Content-Type** | `application/json` |

**Request body:**

```json
{
  "email": "new.employee@turbowelcome.com",
  "first_name": "Иван",
  "last_name": "Петров",
  "password": "securepass123",
  "password_confirm": "securepass123",
  "phone": "+7 (999) 000-00-00",
  "position": "Junior Developer",
  "department": 1,
  "hire_date": "2026-05-21"
}
```

| Поле | Обязательно | Тип | Описание |
|------|:---:|-----|----------|
| `email` | ✅ | string | Email (уникальный) |
| `first_name` | ✅ | string | Имя |
| `last_name` | ✅ | string | Фамилия |
| `password` | ✅ | string | Пароль (мин. 8 символов) |
| `password_confirm` | ✅ | string | Подтверждение пароля |
| `phone` | ❌ | string | Телефон |
| `position` | ❌ | string | Должность |
| `department` | ❌ | number | ID отдела |
| `hire_date` | ❌ | string | Дата найма (`YYYY-MM-DD`) |

**Response `201 Created`:** объект User (роль всегда `NEW`).

**Response `400 Bad Request`:** ошибки валидации (email занят, пароли не совпадают и т.д.).

**Response `403 Forbidden`:** пользователь не HR.

**Пример (axios):**

```javascript
const { data } = await axios.post('/api/v1/auth/users/new/', {
  email: 'new.employee@turbowelcome.com',
  first_name: 'Иван',
  last_name: 'Петров',
  password: 'securepass123',
  password_confirm: 'securepass123',
}, {
  headers: { Authorization: `Bearer ${accessToken}` },
});
```

---

### PATCH / DELETE `/api/v1/auth/users/new/{id}/`

Редактирование и удаление нового сотрудника (`role: NEW`). Доступно **только HR** (`role: HR`).

| | PATCH | DELETE |
|---|---|---|
| **Auth** | ✅ Bearer Token | ✅ Bearer Token |
| **Роль** | `HR` | `HR` |

**PATCH body:** `first_name`, `last_name`, `phone`, `position`, `department`, `hire_date`.

**Response `200 OK`:** обновлённый объект User.

**Response `204 No Content`:** сотрудник удалён.

---

### GET `/api/v1/auth/departments/`

Список отделов для выбора при создании пользователя. Доступен **HR** (`role: HR`) и **админам** (`role: ADM`).

| | |
|---|---|
| **Auth** | ✅ Bearer Token |
| **Роль** | `HR` или `ADM` |
| **Content-Type** | — |

**Response `200 OK`:**

```json
[
  { "id": 1, "name": "IT отдел" },
  { "id": 2, "name": "HR отдел" }
]
```

**Response `403 Forbidden`:** пользователь не HR и не админ.

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
const isAdmin = user.role === 'ADM';
const isHR = user.role === 'HR';
const isManager = user.role === 'MGR';
const isNewEmployee = user.role === 'NEW';
```

---

## Organization — фотогалерея

Базовый префикс: `/api/v1/organization/`

### GET `/organization/gallery/`

Список фото организации. Доступен всем аутентифицированным пользователям.

**Response `200 OK`:** массив объектов (без пагинации)

```json
[
  {
    "id": 1,
    "image": "/media/organization/gallery/office.jpg",
    "image_url": "http://localhost:8000/media/organization/gallery/office.jpg",
    "title": "Офис TurboTech",
    "uploaded_by": 2,
    "uploaded_by_name": "Анна Иванова",
    "created_at": "2026-05-22T08:00:00+03:00"
  }
]
```

| Поле | Тип | Описание |
|------|-----|----------|
| `id` | number | ID фото |
| `image` | string | Относительный путь к файлу |
| `image_url` | string | Полный URL изображения |
| `title` | string | Подпись на обороте карточки (может быть пустым) |
| `uploaded_by` | number \| null | ID пользователя, загрузившего фото |
| `uploaded_by_name` | string \| null | Имя загрузившего (read-only) |
| `created_at` | string | Дата загрузки (ISO 8601) |

### POST `/organization/gallery/`

Загрузка нового фото. Доступен всем аутентифицированным пользователям.

**Content-Type:** `multipart/form-data`

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `image` | file | да | JPG, PNG, WEBP, GIF · до 10 МБ |
| `title` | string | нет | Название фото |

**Response `201 Created`:** объект фото (см. GET)

**Response `400 Bad Request`:** ошибка валидации (формат, размер)

```json
{
  "image": ["Допустимые форматы: JPG, PNG, WEBP, GIF"]
}
```

### PATCH `/organization/gallery/{id}/`

Обновление подписи на обороте карточки (поле `title`). Доступен всем аутентифицированным пользователям.

**Content-Type:** `application/json`

| Поле | Тип | Обязательное | Описание |
|------|-----|--------------|----------|
| `title` | string | нет | Подпись к фото (до 200 символов, может быть пустой) |

**Request body (пример):**

```json
{
  "title": "Офис TurboTech"
}
```

**Response `200 OK`:** объект фото (см. GET)

**Response `400 Bad Request`:** ошибка валидации

**Response `404 Not Found`:** фото не найдено

---

### DELETE `/organization/gallery/{id}/`

Удаление фото из галереи. Доступен всем аутентифицированным пользователям.

**Response `204 No Content`**

**Response `404 Not Found`:** фото не найдено

---

## Changelog

| Дата | Изменение |
|------|-----------|
| 2026-05-22 | PATCH `/organization/gallery/{id}/` — обновление подписи (`title`) |
| 2026-05-22 | GET/POST `/organization/gallery/`, DELETE `/organization/gallery/{id}/` |
| 2026-05-21 | PATCH/DELETE `/auth/users/{id}/` и `/auth/users/new/{id}/` |
| 2026-05-21 | PATCH `/auth/me/` — загрузка аватара (multipart) |
| 2026-05-21 | POST `/auth/users/` для админа; departments доступен ADM и HR |
| 2026-05-21 | POST `/auth/users/new/` и GET `/auth/departments/` для HR |
| 2026-05-21 | Добавлены GET `/auth/users/` (ADM) и GET `/auth/users/new/` (HR) |
| 2026-05-21 | Роли расширены до 4: ADM, HR, MGR, NEW |
| 2026-05-21 | Начальная версия: auth (register, login, me GET/PATCH) |
