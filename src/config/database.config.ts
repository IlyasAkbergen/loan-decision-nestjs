import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get<string>('DB_HOST', 'localhost'),
  port: configService.get<number>('DB_PORT', 5432),
  username: configService.get<string>('DB_USERNAME', 'postgres'),
  password: configService.get<string>('DB_PASSWORD', 'secret'),
  database: configService.get<string>('DB_DATABASE', 'loan_db'),

  // Entity loading
  autoLoadEntities: true,

  // Schema management
  synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false),
  dropSchema: false,

  // Connection management
  retryAttempts: 3,
  retryDelay: 3000,

  // Logging
  logging: configService.get<boolean>('DB_LOGGING', false),
  logger: 'advanced-console',

  // Pool settings for production
  extra: {
    max: 20,
    min: 5,
    acquire: 30000,
    idle: 10000,
  },

  // SSL settings (enable in production)
  ssl: configService.get<string>('NODE_ENV') === 'production' ? {
    rejectUnauthorized: false
  } : false,
});

// Environment validation helper
export const validateDatabaseConfig = (configService: ConfigService): void => {
  const requiredVars = ['DB_HOST', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD', 'DB_DATABASE'];

  const missingVars = requiredVars.filter(
    varName => !configService.get(varName)
  );

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}`
    );
  }
};
