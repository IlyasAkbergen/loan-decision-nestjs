import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmLoanRepository } from './loan.typeorm.repository';
import { LoanTypeOrmEntity } from '../orm/entities/loan.typeorm-entity';
import { Loan } from 'src/loan/domain/entities/loan.entity';
import { LoanConditions } from 'src/loan/domain/value-objects/loan-conditions.value-object';
import { Client } from 'src/client/domain/entities/client.entity';
import { Product } from 'src/product/domain/entities/product.entity';
import { FullName } from 'src/client/domain/value-objects/full-name.value-object';
import { CreditScore } from 'src/client/domain/value-objects/credit-score.value-object';
import { Income } from 'src/client/domain/value-objects/income.value-object';
import { USState } from 'src/client/domain/enums/enums';
import { ProductCode } from 'src/product/domain/enums/product-code.enum';
import { Term } from 'src/product/domain/value-objects/term.value-object';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';
import { v4 } from 'uuid';

describe('TypeOrmLoanRepository', () => {
    let repository: TypeOrmLoanRepository;
    let typeormRepository: jest.Mocked<Repository<LoanTypeOrmEntity>>;

    beforeEach(async () => {
        const mockRepository = {
            save: jest.fn(),
            findOne: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TypeOrmLoanRepository,
                {
                    provide: getRepositoryToken(LoanTypeOrmEntity),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        repository = module.get<TypeOrmLoanRepository>(TypeOrmLoanRepository);
        typeormRepository = module.get(getRepositoryToken(LoanTypeOrmEntity));
    });

    describe('save', () => {
        it('should save loan entity', async () => {
            // Arrange
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(3000),
                USState.CA
            );

            const product = new Product(
                v4(),
                'Personal Loan',
                ProductCode.PERSONAL_LOAN,
                new Term(12),
                new InterestRate(5.5),
                10000
            );

            const conditions = new LoanConditions(
                10000,
                new Term(12),
                new InterestRate(5.5)
            );

            const loan = new Loan(
                v4(),
                client,
                product,
                conditions,
                new Date()
            );

            typeormRepository.save.mockResolvedValue({} as LoanTypeOrmEntity);

            // Act
            await repository.save(loan);

            // Assert
            expect(typeormRepository.save).toHaveBeenCalledWith(
                expect.objectContaining({
                    id: loan.id,
                    clientId: client.id,
                    productId: product.id,
                    sum: 10000,
                    termMonths: 12,
                    interestRate: 5.5,
                })
            );
        });
    });

    describe('findById', () => {
        it('should return null when entity not found', async () => {
            // Arrange
            typeormRepository.findOne.mockResolvedValue(null);

            // Act
            const result = await repository.findById('non-existent-id');

            // Assert
            expect(result).toBeNull();
        });

        it('should return loan entity when found', async () => {
            // Arrange
            const entity = new LoanTypeOrmEntity();
            entity.id = v4();
            entity.clientId = v4();
            entity.productId = v4();
            entity.sum = 10000;
            entity.termMonths = 12;
            entity.interestRate = 5.5;
            entity.createdAt = new Date();

            typeormRepository.findOne.mockResolvedValue(entity);

            // Act
            const result = await repository.findById(entity.id);

            // Assert
            expect(result).toEqual(expect.any(Loan));
            expect(result!.id).toBe(entity.id);
            expect(result!.conditions.sum).toBe(entity.sum);
            expect(result!.conditions.term.months).toBe(entity.termMonths);
            expect(result!.conditions.interestRate.getValue()).toBe(entity.interestRate);
        });
    });
});
