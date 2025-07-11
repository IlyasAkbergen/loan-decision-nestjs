# Абсолютные импорты в TypeScript

Теперь в вашем проекте настроены абсолютные импорты с базовым путем `src/`.

## Что было изменено:

1. **tsconfig.json** - добавлен `baseUrl: "./src"` и `paths` для маппинга
2. **package.json** - добавлен `moduleNameMapper` для Jest
3. **test/jest-e2e.json** - добавлен `moduleNameMapper` для e2e тестов

## Примеры использования:

### До (относительные пути):
```typescript
import { Product } from '../../../../product/domain/entities/product.entity';
import { Client } from '../../../../client/entities/client.entity';
import { Age } from '../../../../client/value-objects/age.value-object';
```

### После (абсолютные пути):
```typescript
import { Product } from 'src/product/domain/entities/product.entity';
import { Client } from 'src/client/entities/client.entity';
import { Age } from 'src/client/value-objects/age.value-object';
```

## Преимущества:

- ✅ Более читаемые импорты
- ✅ Не нужно считать уровни вложенности (`../../../..`)
- ✅ Проще рефакторить и перемещать файлы
- ✅ Работает как в коде, так и в тестах
- ✅ Поддерживается автокомплитом в VS Code

## Примечания:

- Все импорты начинаются с `src/`
- Локальные файлы в той же папке можно по-прежнему импортировать относительно: `./file-name`
- Работает с TypeScript, Jest, и NestJS
