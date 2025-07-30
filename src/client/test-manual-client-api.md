# Manual Testing Guide for Client API

Этот файл содержит примеры запросов для ручного тестирования Client API.

## Prerequisites

Убедитесь, что приложение запущено:
```bash
npm run start:dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

## API Endpoints Testing

### 1. CREATE Client (POST /client)

**Успешное создание клиента:**
```bash
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-01",
    "creditScore": 750,
    "monthlyIncome": 5000,
    "state": "CA"
  }'
```

**Ожидаемый ответ (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "fullName": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "creditScore": {
    "value": 750
  },
  "monthlyIncome": {
    "value": 5000
  },
  "state": "CA"
}
```

**Тест валидации - невалидные данные (400):**
```bash
curl -X POST http://localhost:3000/client \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "",
    "lastName": "",
    "dateOfBirth": "invalid-date",
    "creditScore": 1000,
    "monthlyIncome": -1000,
    "state": "INVALID_STATE"
  }'
```

### 2. GET All Clients (GET /client)

```bash
curl -X GET http://localhost:3000/client
```

**Ожидаемый ответ (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "fullName": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "dateOfBirth": "1990-01-01T00:00:00.000Z",
    "creditScore": {
      "value": 750
    },
    "monthlyIncome": {
      "value": 5000
    },
    "state": "CA"
  }
]
```

### 3. GET Client by ID (GET /client/:id)

**Существующий клиент:**
```bash
curl -X GET http://localhost:3000/client/123e4567-e89b-12d3-a456-426614174000
```

**Несуществующий клиент (404):**
```bash
curl -X GET http://localhost:3000/client/non-existent-id
```

### 4. UPDATE Client (PATCH /client/:id)

**Успешное обновление:**
```bash
curl -X PATCH http://localhost:3000/client/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "creditScore": 800
  }'
```

**Обновление несуществующего клиента (404):**
```bash
curl -X PATCH http://localhost:3000/client/non-existent-id \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane"
  }'
```

**Тест валидации при обновлении (400):**
```bash
curl -X PATCH http://localhost:3000/client/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "creditScore": 1000,
    "monthlyIncome": -1000
  }'
```

### 5. DELETE Client (DELETE /client/:id)

**Успешное удаление:**
```bash
curl -X DELETE http://localhost:3000/client/123e4567-e89b-12d3-a456-426614174000
```

**Удаление несуществующего клиента (404):**
```bash
curl -X DELETE http://localhost:3000/client/non-existent-id
```

## Available US States

Поле `state` должно быть одним из следующих значений:
- `CA` - California
- `NY` - New York  
- `NV` - Nevada
- `TX` - Texas
- `FL` - Florida

## Validation Rules

### firstName & lastName
- Обязательные поля
- Не могут быть пустыми строками

### dateOfBirth
- Должна быть валидная дата в формате ISO 8601 (YYYY-MM-DD)

### creditScore
- Обязательное поле
- Должно быть числом от 300 до 850

### monthlyIncome
- Обязательное поле
- Должно быть положительным числом (>= 0)

### state
- Обязательное поле
- Должно быть одним из доступных US states

## Test Scenarios

### Scenario 1: Complete CRUD Workflow
1. Создать нового клиента (POST)
2. Получить всех клиентов (GET /client)
3. Получить созданного клиента по ID (GET /client/:id)
4. Обновить клиента (PATCH /client/:id)
5. Удалить клиента (DELETE /client/:id)
6. Проверить, что клиент удален (GET /client/:id - должен вернуть 404)

### Scenario 2: Validation Testing
1. Попытаться создать клиента с невалидными данными
2. Попытаться обновить клиента с невалидными данными
3. Проверить обработку отсутствующих обязательных полей

### Scenario 3: Business Logic Testing
1. Создать клиента разного возраста и проверить расчет возраста
2. Создать клиентов с разными credit scores и monthly income
3. Проверить работу со всеми доступными штатами

### Scenario 4: Error Handling
1. Попытаться получить несуществующего клиента
2. Попытаться обновить несуществующего клиента
3. Попытаться удалить несуществующего клиента

## Expected HTTP Status Codes

- **200 OK**: Успешный GET, PATCH, DELETE
- **201 Created**: Успешный POST
- **400 Bad Request**: Ошибки валидации
- **404 Not Found**: Ресурс не найден

## Notes

- Все ID генерируются автоматически как UUID v4
- Даты возвращаются в формате ISO 8601
- Credit score автоматически валидируется value object'ом
- Monthly income должен быть неотрицательным
- Возраст рассчитывается автоматически на основе dateOfBirth
