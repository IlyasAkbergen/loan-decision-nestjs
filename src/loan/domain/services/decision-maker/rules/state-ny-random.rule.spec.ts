import { StateNyRandomRule } from './state-ny-random.rule';
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

describe('StateNyRandomRule', () => {
    let rule: StateNyRandomRule;
    let product: Product;

    beforeEach(() => {
        rule = new StateNyRandomRule();
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
        it('should not change decision for client from CA', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(2000),
                USState.CA
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
        });

        it('should not change decision for client from NV', () => {
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(2000),
                USState.NV
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
        });

        it('should randomly deny some NY clients (test with mocked Math.random)', () => {
            // Mock Math.random to return 0.3 (< 0.5, should deny)
            const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.3);
            
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(2000),
                USState.NY
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.DENIED);
            
            mockMathRandom.mockRestore();
        });

        it('should approve some NY clients (test with mocked Math.random)', () => {
            // Mock Math.random to return 0.7 (>= 0.5, should approve)
            const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.7);
            
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(2000),
                USState.NY
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
            
            mockMathRandom.mockRestore();
        });

        it('should deny NY client when random value is exactly 0.5', () => {
            // Mock Math.random to return exactly 0.5 (should still deny because < 0.5 is false)
            const mockMathRandom = jest.spyOn(Math, 'random').mockReturnValue(0.5);
            
            const client = new Client(
                v4(),
                new FullName('John', 'Doe'),
                new Date(new Date().getFullYear() - 30, 0, 1),
                new CreditScore(700),
                new Income(2000),
                USState.NY
            );
            const decision = new LoanDecision(client, product, null, Decision.APPROVED);

            rule.apply(decision);

            expect(decision.getDecision()).toBe(Decision.APPROVED);
            
            mockMathRandom.mockRestore();
        });
    });

    describe('getCode', () => {
        it('should return STATE_NY_RANDOM rule code', () => {
            expect(rule.getCode()).toBe(RuleCode.STATE_NY_RANDOM);
        });
    });
});
