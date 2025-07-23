import { RuleRegistry } from "../../../infrastructure/config/decision-maker/rule.registry";
import { ProductCode } from "../../../../product/domain/enums/product-code.enum";
import { RuleInterface } from "./rule-interface";
import { RuleCode } from "../../enums/enums";

export class ProductRulesProvider {
    constructor(private readonly productRulesRepository: RuleRegistry) {}

    public getRules(productCode: ProductCode): RuleInterface[] {
        return this.productRulesRepository.findByCodes(this.getRuleCodes(productCode));
    }

    private getRuleCodes(productCode: ProductCode): RuleCode[] {
        switch (productCode) {
            case ProductCode.PERSONAL_LOAN:
                return [
                    RuleCode.CREDIT_RATING,
                    RuleCode.INCOME,
                    RuleCode.AGE,
                    RuleCode.STATE_EXCLUSIVE,
                    RuleCode.STATE_NY_RANDOM,
                    RuleCode.STATE_CA_INTEREST_INCREASE,
                ];
            default:
                return [];
        }
    }
}
