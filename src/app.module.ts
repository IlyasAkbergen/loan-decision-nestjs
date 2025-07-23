import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from './client/client.module';
import { ProductModule } from './product/product.module';
import { LoanModule } from './loan/loan.module';
import { getDatabaseConfig, validateDatabaseConfig } from './config/database.config';

@Module({
  imports: [
    // Configuration module - load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: (config) => {
        const configService = new ConfigService(config);
        validateDatabaseConfig(configService);
        return config;
      },
    }),
    
    // Database configuration with best practices
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => getDatabaseConfig(configService),
      inject: [ConfigService],
    }),
    
    // Feature modules
    ClientModule,
    ProductModule,
    LoanModule,
  ],
})
export class AppModule {}
