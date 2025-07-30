import { Product } from 'src/product/domain/entities/product.entity';
import { DecisionMaker } from './decision-maker';
import { ProductRulesProvider } from './product-rules-provider';
import { RuleRegistry } from 'src/loan/infrastructure/config/decision-maker/rule.registry';
import { AlwaysDenyRule } from 'src/loan/__test__/fake/decision-maker/rules/always-deny.rule';
import { DumpRule } from 'src/loan/__test__/fake/decision-maker/rules/dump.rule';
import { ProductCode } from 'src/product/domain/enums/product-code.enum';
import { v4 } from 'uuid';
import { Decision } from '../../enums/enums';
import { Client } from 'src/client/domain/entities/client.entity';
import { FullName } from 'src/client/domain/value-objects/full-name.value-object';
import { CreditScore } from 'src/client/domain/value-objects/credit-score.value-object';
import { Income } from 'src/client/domain/value-objects/income.value-object';
import { USState } from 'src/client/domain/enums/enums';
import { InterestRate } from 'src/product/domain/value-objects/interest-rate.value-object';

describe('DecisionMaker', () => {
    let decisionMaker: DecisionMaker;
    let productRulesProvider: ProductRulesProvider;
    let rulesRepository: RuleRegistry;
    let product: Product;
    let client: Client;

    beforeEach(() => {
        rulesRepository = new RuleRegistry([]);
        productRulesProvider = new ProductRulesProvider(rulesRepository);
        decisionMaker = new DecisionMaker(
            productRulesProvider,
        );
        product = new Product(
            '1',
            'Test Product',
            ProductCode.PERSONAL_LOAN,
            { months: 12 },
            new InterestRate(5),
            10000,
        );
        client = new Client(
            v4(),
            new FullName('Iliyas', 'Akbergen'),
            new Date(new Date().getFullYear() - 30, 0, 1),
            new CreditScore(700),
            new Income(3000),
            USState.CA,
        );
    });

    describe('decide', () => {
        it('should return a decision with status DENIED if any rule denies', async () => {
            jest.spyOn(productRulesProvider, 'getRules').mockResolvedValue([
                new DumpRule(null),
                new AlwaysDenyRule(),
            ]);
            const decision = await decisionMaker.decide(product, client);
            expect(decision.getDecision()).toBe(Decision.DENIED);
        })

        it('should return a decision with status APPROVE if no rule denies', async () => {
            jest.spyOn(productRulesProvider, 'getRules').mockResolvedValue([
                new DumpRule(null),
            ]);
            const decision = await decisionMaker.decide(product, client);
            expect(decision.getDecision()).toBe(Decision.APPROVED);
        })

        it('should return a decision with status APPROVED_WITH_CHANGES if any rule matches the conditions', async () => {
            jest.spyOn(productRulesProvider, 'getRules').mockResolvedValue([
                new DumpRule(Decision.APPROVED_WITH_CHANGES),
            ]);
            const decision = await decisionMaker.decide(product, client);
            expect(decision.getDecision()).toBe(Decision.APPROVED_WITH_CHANGES);
        })
    });
})
