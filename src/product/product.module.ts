import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { ProductTypeOrmEntity } from './infrastructure/orm/entities/product.typeorm-entity';
import { TypeOrmProductRepository } from './infrastructure/persistence/product.typeorm.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ProductTypeOrmEntity])],
  controllers: [ProductController],
  providers: [
    ProductService,
    {
      provide: 'ProductRepository',
      useClass: TypeOrmProductRepository,
    },
  ],
  exports: ['ProductRepository'],
})
export class ProductModule {}
