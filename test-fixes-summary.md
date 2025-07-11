# Обновление тестов для новой структуры Client

## Что было изменено:

### 1. Структура Client
Обновлена сущность `Client` для включения всех обязательных полей:
- `id: string`
- `fullName: FullName`
- `age: Age`
- `creditScore: CreditScore`
- `monthlyIncome: MonthlyIncome`
- `state: USState`

### 2. Обновленные тесты:

#### `age.rule.spec.ts`
- ✅ Исправлены все конструкторы Client
- ✅ Добавлены обязательные поля: creditScore, monthlyIncome, state
- ✅ Обновлены импорты для использования абсолютных путей

#### `credit-score.rule.spec.ts`
- ✅ Исправлены все конструкторы Client
- ✅ Добавлены обязательные поля
- ✅ Обновлены импорты

#### `income.rule.spec.ts`
- ✅ Исправлены все конструкторы Client
- ✅ Обновлены импорты для правильных путей
- ✅ Добавлены недостающие поля

#### `decision-maker.spec.ts`
- ✅ Исправлен конструктор Client
- ✅ Исправлен конструктор Product (InterestRate)
- ✅ Добавлены все обязательные поля

### 3. Созданные/обновленные файлы:

#### Value Objects:
- `src/client/domain/value-objects/credit-score.value-object.ts`
- `src/client/domain/value-objects/monthly-income.value-object.ts`
- `src/client/domain/value-objects/state.value-object.ts`

#### Enums:
- `src/client/domain/enums/enums.ts` (USState enum)

### 4. Результат:
- ✅ Все 9 тестовых наборов проходят
- ✅ 24 теста успешно выполняются
- ✅ Время выполнения: ~3.7 секунды
- ✅ Нет ошибок компиляции
- ✅ Абсолютные импорты работают корректно

### 5. Основные изменения в тестах:
Было:
```typescript
const client = new Client(
    v4(),
    new FullName('John', 'Doe'),
    new Age(30)
);
```

Стало:
```typescript
const client = new Client(
    v4(),
    new FullName('John', 'Doe'),
    new Age(30),
    new CreditScore(700),
    new MonthlyIncome(3000),
    USState.CA
);
```

Все конструкторы Client теперь включают все 6 обязательных параметров, что соответствует обновленной структуре сущности.
