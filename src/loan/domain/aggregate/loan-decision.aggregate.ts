import { Product } from "src/product/domain/entities/product.entity";
import { LoanConditions } from "../value-objects/loan-conditions.value-object";
import { Client } from "src/client/domain/entities/client.entity";
import { Decision } from "../enums/enums";
import { InterestRate } from "src/product/domain/value-objects/interest-rate.value-object";

export class LoanDecision {
    constructor(
        public readonly client: Client,
        public readonly product: Product,
        public conditions: LoanConditions|null,
        private decision: Decision,
    ) {}

    setDecision(decision: Decision): void {
        this.decision = decision;
    }

    getDecision(): Decision {
        return this.decision;
    }

    increaseInterestRate(percentage: number): void {
        if (this.conditions) {
            const newInterestRate = this.conditions.interestRate.increaseBy(percentage);
            this.conditions = new LoanConditions(
                this.conditions.sum,
                this.conditions.term,
                newInterestRate
            );
            this.setDecision(Decision.APPROVED_WITH_CHANGES);
        }
    }
}
