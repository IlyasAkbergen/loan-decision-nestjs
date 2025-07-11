import { LoanDecision } from "src/loan/domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "src/loan/domain/enums/enums";
import { RuleInterface } from "../rule-interface";

export class IncomeRule implements RuleInterface {
    private readonly MIN_MONTHLY_INCOME = 1000;

    apply(decision: LoanDecision): void {
        if (!decision.client.monthlyIncome.isGreaterThanOrEqualTo(this.MIN_MONTHLY_INCOME)) {
            decision.setDecision(Decision.DENIED);
        }
    }

    getCode(): RuleCode {
        return RuleCode.INCOME;
    }
}
