import { StateCaInterestIncreaseRule } from './state-ca-interest-increase.rule';
import { LoanDecision } from 'src/loan/domain/aggregate/loan-decision.aggregate';
import { LoanConditions } from 'src/loan/domain/value-objects/loan-conditions.value-object';
import { Client } from 'src/client/domain/entities/client.entity';
import { FullName } from 'src/client/domain/value-objects/full-name.value-object';
import { Age } from 'src/client/domain/value-objects/age.value-object';
import { CreditScore } from 'src/client/domain/value-objects/credit-score.value-object';
import { MonthlyIncome } from 'src/client/domain/value-objects/monthly-income.value-object';
import { USState } from 'src/client/domain/enums/enums';
import { Product } from 'src/product/domain/entities/product.entity';
import { ProductCode } from 'src/product/domain/enums/product-code.enum';
import { Decision, RuleCode } from 'src/loan/domain/enums/enums';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';
import { Term } from 'src/product/domain/value-objects/term.value-object';
import { v4 } from 'uuid';

describe('StateCaInterestIncreaseRule', () => {
    let rule: StateCaInterestIncreaseRule;
    let product: Product;

    beforeEach(() => {
        rule = new StateCaInterestIncreaseRule();
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
        it('should not change decision for client from NY', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(30),
                new CreditScore(700),
                new MonthlyIncome(2000),
                USState.NY
            );
            const loanConditions = new LoanConditions(
                10000,
                new Term(12),
                new InterestRate(5)
            );
            const decision = new LoanDecision(client, product, loanConditions, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
            expect(decision.conditions?.interestRate.getValue()).toBe(5);
        });

        it('should not change decision for client from NV', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(30),
                new CreditScore(700),
                new MonthlyIncome(2000),
                USState.NV
            );
            const loanConditions = new LoanConditions(
                10000,
                new Term(12),
                new InterestRate(5)
            );
            const decision = new LoanDecision(client, product, loanConditions, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
            expect(decision.conditions?.interestRate.getValue()).toBe(5);
        });

        it('should increase interest rate by 11.49% for CA clients', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(30),
                new CreditScore(700),
                new MonthlyIncome(2000),
                USState.CA
            );
            const loanConditions = new LoanConditions(
                10000,
                new Term(12),
                new InterestRate(5)
            );
            const decision = new LoanDecision(client, product, loanConditions, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED_WITH_CHANGES);
            expect(decision.conditions?.interestRate.getValue()).toBeCloseTo(16.49, 2); // 5 + 11.49
        });

        it('should increase interest rate for CA clients even with high initial rate', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(30),
                new CreditScore(700),
                new MonthlyIncome(2000),
                USState.CA
            );
            const loanConditions = new LoanConditions(
                10000,
                new Term(12),
                new InterestRate(15)
            );
            const decision = new LoanDecision(client, product, loanConditions, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED_WITH_CHANGES);
            expect(decision.conditions?.interestRate.getValue()).toBeCloseTo(26.49, 2); // 15 + 11.49
        });

        it('should not modify conditions if no loan conditions exist', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(30),
                new CreditScore(700),
                new MonthlyIncome(2000),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
            expect(decision.conditions).toBeNull();
        });
    });

    describe('getCode', () => {
        it('should return STATE_CA_INTEREST_INCREASE rule code', () => {
            expect(rule.getCode()).toBe(RuleCode.STATE_CA_INTEREST_INCREASE);
        });
    });
});
