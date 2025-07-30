import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { LoanTypeOrmEntity } from './loan/infrastructure/orm/entities/loan.typeorm-entity';
import { ProductTypeOrmEntity } from './product/infrastructure/orm/entities/product.typeorm-entity';
import { ClientTypeOrmEntity } from './client/infrastructure/orm/entities/client.typeorm-entity';

export const createDataSource = (config: ConfigService): DataSource => {
  return new DataSource({
    type: 'postgres',
    host: config.get<string>('DB_HOST', 'localhost'),
    port: config.get<number>('DB_PORT', 5432),
    username: config.get<string>('DB_USERNAME', 'postgres'),
    password: config.get<string>('DB_PASSWORD', 'secret'),
    database: config.get<string>('DB_DATABASE', 'loan_db'),
    entities: [LoanTypeOrmEntity, ProductTypeOrmEntity, ClientTypeOrmEntity],
    synchronize: config.get<boolean>('DB_SYNCHRONIZE', true),
    logging: config.get<boolean>('DB_LOGGING', false),
    migrations: ['src/**/migrations/*.ts'],
    migrationsTableName: 'migrations',
  });
};

// Default data source for CLI tools
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'secret',
  database: process.env.DB_DATABASE || 'loan_db',
  entities: [LoanTypeOrmEntity, ProductTypeOrmEntity, ClientTypeOrmEntity],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
  migrations: ['src/**/migrations/*.ts'],
  migrationsTableName: 'migrations',
});
