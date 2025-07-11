import { Product } from "src/product/domain/entities/product.entity";
import { ProductRulesProvider } from "./product-rules-provider";
import { Client } from "src/client/domain/entities/client.entity";
import { LoanDecision } from "../../aggregate/loan-decision.aggregate";
import { Decision } from "../../enums/enums";

export class DecisionMaker {
    constructor(private readonly productRulesProvider: ProductRulesProvider) {}

    public decide(product: Product, client: Client): LoanDecision {
        const rules = this.productRulesProvider.getRules(product.code);
        const decision = new LoanDecision(client, product, null, Decision.APPROVED);

        for (const rule of rules) {
            rule.apply(decision);
            if (decision.getDecision() === Decision.DENIED) {
                return decision;
            }
        }

        return decision;
    }
}
