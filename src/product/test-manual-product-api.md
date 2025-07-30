# Manual Testing Guide for Product API

Этот файл содержит примеры запросов для ручного тестирования Product API.

## Prerequisites

Убедитесь, что приложение запущено:
```bash
npm run start:dev
```

Приложение будет доступно по адресу: `http://localhost:3000`

## API Endpoints Testing

### 1. CREATE Product (POST /product)

**Успешное создание продукта:**
```bash
curl -X POST http://localhost:3000/product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Personal Loan",
    "code": "PERSONAL_LOAN",
    "termMonths": 24,
    "interestRate": 5.5,
    "sum": 10000
  }'
```

**Ожидаемый ответ (201):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Personal Loan",
  "code": "PERSONAL_LOAN",
  "term": {
    "months": 24
  },
  "interestRate": {
    "value": 5.5
  },
  "sum": 10000
}
```

**Тест валидации - невалидные данные (400):**
```bash
curl -X POST http://localhost:3000/product \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "code": "INVALID_CODE",
    "termMonths": -1,
    "interestRate": 150,
    "sum": -1000
  }'
```

### 2. GET All Products (GET /product)

```bash
curl -X GET http://localhost:3000/product
```

**Ожидаемый ответ (200):**
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "name": "Personal Loan",
    "code": "PERSONAL_LOAN",
    "term": {
      "months": 24
    },
    "interestRate": {
      "value": 5.5
    },
    "sum": 10000
  }
]
```

### 3. GET Product by ID (GET /product/:id)

**Существующий продукт:**
```bash
curl -X GET http://localhost:3000/product/123e4567-e89b-12d3-a456-426614174000
```

**Несуществующий продукт (404):**
```bash
curl -X GET http://localhost:3000/product/non-existent-id
```

### 4. UPDATE Product (PATCH /product/:id)

**Успешное обновление:**
```bash
curl -X PATCH http://localhost:3000/product/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Personal Loan",
    "interestRate": 6.0
  }'
```

**Обновление несуществующего продукта (404):**
```bash
curl -X PATCH http://localhost:3000/product/non-existent-id \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Personal Loan"
  }'
```

**Тест валидации при обновлении (400):**
```bash
curl -X PATCH http://localhost:3000/product/123e4567-e89b-12d3-a456-426614174000 \
  -H "Content-Type: application/json" \
  -d '{
    "interestRate": 150,
    "termMonths": -1
  }'
```

### 5. DELETE Product (DELETE /product/:id)

**Успешное удаление:**
```bash
curl -X DELETE http://localhost:3000/product/123e4567-e89b-12d3-a456-426614174000
```

**Удаление несуществующего продукта (404):**
```bash
curl -X DELETE http://localhost:3000/product/non-existent-id
```

## Test Scenarios

### Scenario 1: Complete CRUD Workflow
1. Создать новый продукт (POST)
2. Получить все продукты (GET /product)
3. Получить созданный продукт по ID (GET /product/:id)
4. Обновить продукт (PATCH /product/:id)
5. Удалить продукт (DELETE /product/:id)
6. Проверить, что продукт удален (GET /product/:id - должен вернуть 404)

### Scenario 2: Validation Testing
1. Попытаться создать продукт с невалидными данными
2. Попытаться обновить продукт с невалидными данными
3. Проверить обработку отсутствующих обязательных полей

### Scenario 3: Error Handling
1. Попытаться получить несуществующий продукт
2. Попытаться обновить несуществующий продукт
3. Попытаться удалить несуществующий продукт

## Expected HTTP Status Codes

- **200 OK**: Успешный GET, PATCH, DELETE
- **201 Created**: Успешный POST
- **400 Bad Request**: Ошибки валидации
- **404 Not Found**: Ресурс не найден

## Notes

- Все ID генерируются автоматически как UUID v4
- Поле `code` должно быть одним из значений enum `ProductCode`
- `termMonths` должен быть положительным числом
- `interestRate` должен быть между 0 и 100
- `sum` должен быть положительным числом
