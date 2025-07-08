import { Module } from '@nestjs/common';
import { ApplyForLoanUseCase } from './app/use-cases/apply-for-loan.use-case';
import { TypeOrmLoanRepository } from './infrastructure/persistence/typeorm-loan.repository';

@Module({
    providers: [
        ApplyForLoanUseCase,
        {
            provide: 'LoanRepository',
            useClass: TypeOrmLoanRepository,
        }
    ]
})
export class LoanModule {}