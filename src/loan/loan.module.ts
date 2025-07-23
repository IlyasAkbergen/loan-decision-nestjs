import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeRule } from './domain/services/decision-maker/rules/income.rule';
import { CreditScoreRule } from './domain/services/decision-maker/rules/credit-score.rule';
import { AgeRule } from './domain/services/decision-maker/rules/age.rule';
import { RuleRegistry } from './infrastructure/config/decision-maker/rule.registry';
import { StateCaInterestIncreaseRule } from './domain/services/decision-maker/rules/state-ca-interest-increase.rule';
import { StateExclusiveRule } from './domain/services/decision-maker/rules/state-exclusive.rule';
import { StateNyRandomRule } from './domain/services/decision-maker/rules/state-ny-random.rule';
import { LoanTypeOrmEntity } from './infrastructure/orm/entities/loan.typeorm-entity';
import { TypeOrmLoanRepository } from './infrastructure/persistence/loan.typeorm.repository';
import { LoanRepository } from './domain/repositories/loan.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([LoanTypeOrmEntity])
    ],
    providers: [
        {
            provide: 'RULES',
            useFactory: () => [
                new AgeRule,
                new CreditScoreRule,
                new IncomeRule,
                new StateCaInterestIncreaseRule,
                new StateExclusiveRule,
                new StateNyRandomRule,
            ],
        },
        RuleRegistry,
        {
            provide: 'LoanRepository',
            useClass: TypeOrmLoanRepository,
        },
        TypeOrmLoanRepository,
    ],
    exports: ['LoanRepository', TypeOrmLoanRepository],
})
export class LoanModule {}
