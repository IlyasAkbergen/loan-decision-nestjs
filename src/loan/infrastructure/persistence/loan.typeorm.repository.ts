import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanRepository } from 'src/loan/domain/repositories/loan.repository';
import { Loan } from 'src/loan/domain/entities/loan.entity';
import { LoanTypeOrmEntity } from '../orm/entities/loan.typeorm-entity';
import { LoanMapper } from './loan.mapper';
import { Client } from 'src/client/domain/entities/client.entity';
import { Product } from 'src/product/domain/entities/product.entity';
import { FullName } from 'src/client/domain/value-objects/full-name.value-object';
import { CreditScore } from 'src/client/domain/value-objects/credit-score.value-object';
import { Income } from 'src/client/domain/value-objects/income.value-object';
import { USState } from 'src/client/domain/enums/enums';
import { ProductCode } from 'src/product/domain/enums/product-code.enum';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';
import { Term } from 'src/product/domain/value-objects/term.value-object';

@Injectable()
export class TypeOrmLoanRepository implements LoanRepository {
    constructor(
        @InjectRepository(LoanTypeOrmEntity)
        private readonly loanRepository: Repository<LoanTypeOrmEntity>,
    ) {}

    async save(loan: Loan): Promise<void> {
        const entity = LoanMapper.toPersistence(loan);
        await this.loanRepository.save(entity);
    }

    async findById(id: string): Promise<Loan | null> {
        const entity = await this.loanRepository.findOne({ where: { id } });
        if (!entity) {
            return null;
        }

        // For now, create mock client and product data for testing
        // In a real implementation, these would be loaded from their respective repositories
        const mockClient = new Client(
            entity.clientId,
            new FullName('John', 'Doe'),
            new Date(new Date().getFullYear() - 30, 0, 1),
            new CreditScore(700),
            new Income(3000),
            USState.CA
        );

        const mockProduct = new Product(
            entity.productId,
            'Personal Loan',
            ProductCode.PERSONAL_LOAN,
            new Term(entity.termMonths),
            new InterestRate(entity.interestRate),
            entity.sum
        );

        return LoanMapper.toDomain(entity, mockClient, mockProduct);
    }
}
