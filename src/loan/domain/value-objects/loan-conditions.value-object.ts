import { InterestRate } from "src/product/domain/value-objects/interest-rate.value-object";
import { Term } from "src/product/domain/value-objects/term.value-object";

export class LoanConditions {
    constructor(
        public readonly sum: number,
        public readonly term: Term,
        public readonly interestRate: InterestRate,
    ) {}
}
