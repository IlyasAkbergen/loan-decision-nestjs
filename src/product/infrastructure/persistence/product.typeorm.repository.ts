import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from 'src/product/domain/repositories/product.repository';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductTypeOrmEntity } from '../orm/entities/product.typeorm-entity';
import { ProductMapper } from './product.mapper';

@Injectable()
export class TypeOrmProductRepository implements ProductRepository {
    constructor(
        @InjectRepository(ProductTypeOrmEntity)
        private readonly productRepository: Repository<ProductTypeOrmEntity>,
    ) {}

    async save(product: Product): Promise<void> {
        const entity = ProductMapper.toPersistence(product);
        await this.productRepository.save(entity);
    }

    async findById(id: string): Promise<Product | null> {
        const entity = await this.productRepository.findOne({ where: { id } });
        if (!entity) {
            return null;
        }

        return ProductMapper.toDomain(entity);
    }

    async findAll(): Promise<Product[]> {
        const entities = await this.productRepository.find();

        return entities.map(entity => ProductMapper.toDomain(entity));
    }

    async delete(id: string): Promise<void> {
        await this.productRepository.delete(id);
    }
}
