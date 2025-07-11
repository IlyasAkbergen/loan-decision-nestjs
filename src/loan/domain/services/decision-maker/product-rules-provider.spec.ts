import { ProductCode } from '../../../../product/domain/enums/product-code.enum';
import { ProductRulesProvider } from './product-rules-provider';
import { RuleRegistry } from '../../../infrastructure/config/decision-maker/rule.registry';
import { RuleInterface } from './rule-interface';

describe('ProductRulesProvider', () => {
    let productRulesProvider: ProductRulesProvider;
    let productRulesRepository: RuleRegistry;

    beforeEach(() => {
        productRulesRepository = new RuleRegistry();
        productRulesProvider = new ProductRulesProvider(productRulesRepository);
    });

    describe('getRules', () => {
        it('should return an array of rules for a given product', () => {
            const ruleInterfaceMock: jest.Mocked<RuleInterface> = {
                getCode: jest.fn().mockReturnValue('mock_rule_code'),
                apply: jest.fn(),
            };
            jest.spyOn(productRulesRepository, 'findByCodes').mockReturnValue([
                ruleInterfaceMock,
            ]);
            const rules = productRulesProvider.getRules(ProductCode.PERSONAL_LOAN);
            expect(rules).toBeInstanceOf(Array);
            expect(rules.length).toBe(1);
        });
    });
})
