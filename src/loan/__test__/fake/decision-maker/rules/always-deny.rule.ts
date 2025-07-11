import { LoanDecision } from "../../../../domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "../../../../domain/enums/enums";
import { RuleInterface } from "../../../../domain/services/decision-maker/rule-interface";

export class AlwaysDenyRule implements RuleInterface {
    getCode(): RuleCode {
        return RuleCode.DUMP;
    }

    apply(decision: LoanDecision): void {
        decision.setDecision(Decision.DENIED);
    }
}