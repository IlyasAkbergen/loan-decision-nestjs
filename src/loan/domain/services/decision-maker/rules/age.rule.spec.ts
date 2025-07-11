import { LoanDecision } from "src/loan/domain/aggregate/loan-decision.aggregate";
import { AgeRule } from "./age.rule";
import { Client } from "src/client/domain/entities/client.entity";
import { v4 } from "uuid";
import { FullName } from "src/client/domain/value-objects/full-name.value-object";
import { Age } from "src/client/domain/value-objects/age.value-object";
import { Product } from "src/product/domain/entities/product.entity";
import { Decision, RuleCode } from "src/loan/domain/enums/enums";
import { ProductCode } from "src/product/domain/enums/product-code.enum";
import { InterestRate } from "src/product/domain/value-objects/interest-rate.value-object";
import { CreditScore } from "src/client/domain/value-objects/credit-score.value-object";
import { MonthlyIncome } from "src/client/domain/value-objects/monthly-income.value-object";
import { USState } from "src/client/domain/enums/enums";

describe('AgeRule', () => {
    let ageRule: AgeRule;
    let product: Product;

    beforeEach(() => {
        ageRule = new AgeRule();
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
        it('should deny loan for client under 18', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(17),
                new CreditScore(700),
                new MonthlyIncome(3000),
                USState.CA,
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            ageRule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.DENIED);
        });

        it('should deny loan for client over 60', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(61),
                new CreditScore(700),
                new MonthlyIncome(3000),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            ageRule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.DENIED);
        });

        it('should not change decision for client aged 18', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(18),
                new CreditScore(700),
                new MonthlyIncome(3000),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            ageRule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
        });

        it('should not change decision for client aged 60', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(60),
                new CreditScore(700),
                new MonthlyIncome(3000),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            ageRule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
        });

        it('should not change decision for client aged 30', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Age(30),
                new CreditScore(700),
                new MonthlyIncome(3000),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            ageRule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
        });
    });

    describe('getCode', () => {
        it('should return AGE rule code', () => {
            expect(ageRule.getCode()).toBe(RuleCode.AGE);
        });
    });
});
