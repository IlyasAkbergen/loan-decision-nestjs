import { Loan } from 'src/loan/domain/entities/loan.entity';
import { LoanTypeOrmEntity } from '../orm/entities/loan.typeorm-entity';
import { Client } from 'src/client/domain/entities/client.entity';
import { Product } from 'src/product/domain/entities/product.entity';
import { LoanConditions } from 'src/loan/domain/value-objects/loan-conditions.value-object';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';
import { Term } from 'src/product/domain/value-objects/term.value-object';

export class LoanMapper {
    static toDomain(
        entity: LoanTypeOrmEntity,
        client: Client,
        product: Product
    ): Loan {
        const conditions = new LoanConditions(
            entity.sum,
            new Term(entity.termMonths),
            new InterestRate(entity.interestRate)
        );

        return new Loan(
            entity.id,
            client,
            product,
            conditions,
            entity.createdAt
        );
    }

    static toPersistence(loan: Loan): LoanTypeOrmEntity {
        const entity = new LoanTypeOrmEntity();
        entity.id = loan.id;
        entity.clientId = loan.client.id;
        entity.productId = loan.product.id;
        entity.sum = loan.conditions.sum;
        entity.termMonths = loan.conditions.term.months;
        entity.interestRate = loan.conditions.interestRate.getValue();
        entity.createdAt = loan.createdAt;

        return entity;
    }
}
