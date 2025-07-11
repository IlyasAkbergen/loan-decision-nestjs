import { LoanDecision } from "src/loan/domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "src/loan/domain/enums/enums";
import { RuleInterface } from "../rule-interface";

export class CreditScoreRule implements RuleInterface {
    private readonly MIN_CREDIT_SCORE = 500;

    apply(decision: LoanDecision): void {
        if (!decision.client.hasSufficientCreditScore(this.MIN_CREDIT_SCORE)) {
            decision.setDecision(Decision.DENIED);
        }
    }

    getCode(): RuleCode {
        return RuleCode.CREDIT_RATING;
    }
}
