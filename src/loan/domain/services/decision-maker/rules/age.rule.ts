import { LoanDecision } from "src/loan/domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "src/loan/domain/enums/enums";
import { RuleInterface } from "../rule-interface";

export class AgeRule implements RuleInterface {
    apply(decision: LoanDecision): void {
        if (!decision.client.isAdult() || decision.client.isSenior()) {
            decision.setDecision(Decision.DENIED);
        }
    }

    getCode(): RuleCode {
        return RuleCode.AGE;
    }
}
