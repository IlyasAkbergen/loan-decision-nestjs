import { LoanDecision } from "src/loan/domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "src/loan/domain/enums/enums";
import { RuleInterface } from "../rule-interface";
import { USState } from "src/client/domain/enums/enums";

export class StateExclusiveRule implements RuleInterface {
    private readonly ALLOWED_STATES = [USState.CA, USState.NY, USState.NV];

    apply(decision: LoanDecision): void {
        if (!this.ALLOWED_STATES.includes(decision.client.state)) {
            decision.setDecision(Decision.DENIED);
        }
    }

    getCode(): RuleCode {
        return RuleCode.STATE_EXCLUSIVE;
    }
}
