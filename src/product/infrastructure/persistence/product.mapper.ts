import { Product } from 'src/product/domain/entities/product.entity';
import { ProductTypeOrmEntity } from '../orm/entities/product.typeorm-entity';
import { ProductCode } from 'src/product/domain/enums/product-code.enum';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';
import { Term } from 'src/product/domain/value-objects/term.value-object';

export class ProductMapper {
    static toDomain(entity: ProductTypeOrmEntity): Product {
        return new Product(
            entity.id,
            entity.name,
            entity.code as ProductCode,
            new Term(entity.termMonths),
            new InterestRate(entity.interestRate),
            entity.sum
        );
    }

    static toPersistence(product: Product): ProductTypeOrmEntity {
        const entity = new ProductTypeOrmEntity();
        entity.id = product.id;
        entity.name = product.name;
        entity.code = product.code;
        entity.termMonths = product.term.months;
        entity.interestRate = product.interestRate.value;
        entity.sum = product.sum;
        return entity;
    }
}
