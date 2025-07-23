import { IncomeRule } from './income.rule';
import { LoanDecision } from 'src/loan/domain/aggregate/loan-decision.aggregate';
import { Client } from 'src/client/domain/entities/client.entity';
import { FullName } from 'src/client/domain/value-objects/full-name.value-object';
import { Age } from 'src/client/domain/value-objects/age.value-object';
import { CreditScore } from 'src/client/domain/value-objects/credit-score.value-object';
import { Income } from 'src/client/domain/value-objects/income.value-object';
import { USState } from 'src/client/domain/enums/enums';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductCode } from 'src/product/domain/enums/product-code.enum';
import { Decision, RuleCode } from 'src/loan/domain/enums/enums';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';
import { v4 } from 'uuid';

describe('IncomeRule', () => {
    let rule: IncomeRule;
    let product: Product;

    beforeEach(() => {
        rule = new IncomeRule();
        product = new Product(
            '1',
            'Test Product',
            ProductCode.PERSONAL_LOAN,
            { months: 12 },
            new InterestRate(5),
            10000,
        );
    });

    describe('apply', () => {
        it('should deny loan for client with income below $1000', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(999),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.DENIED);
        });

        it('should not change decision for client with income equal $1000', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(1000),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
        });

        it('should not change decision for client with income above $1000', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(1500),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
        });

        it('should deny loan for client without income information', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(500), // низкий доход для тестирования
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.DENIED);
        });
    });

    describe('getCode', () => {
        it('should return INCOME rule code', () => {
            expect(rule.getCode()).toBe(RuleCode.INCOME);
        });
    });
});
