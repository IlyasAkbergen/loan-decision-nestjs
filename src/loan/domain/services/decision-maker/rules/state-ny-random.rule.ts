import { LoanDecision } from "src/loan/domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "src/loan/domain/enums/enums";
import { RuleInterface } from "../rule-interface";
import { USState } from "src/client/domain/enums/enums";

export class StateNyRandomRule implements RuleInterface {
    apply(decision: LoanDecision): void {
        if (decision.client.state && decision.client.state === USState.NY) {
            const randomValue = Math.random();
            if (randomValue < 0.5) {
                decision.setDecision(Decision.DENIED);
            }
        }
    }

    getCode(): RuleCode{
        return RuleCode.STATE_NY_RANDOM;
    }
}
