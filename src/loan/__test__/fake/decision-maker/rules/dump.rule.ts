import { LoanDecision } from "../../../../domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "../../../../domain/enums/enums";
import { RuleInterface } from "../../../../domain/services/decision-maker/rule-interface";

export class DumpRule implements RuleInterface {
    constructor(
        private readonly decisionToSet: Decision|null,
    ) {}

    getCode(): RuleCode {
        return RuleCode.DUMP;
    }

    apply(decision: LoanDecision): void {
        if (this.decisionToSet !== null) {
            decision.setDecision(this.decisionToSet);
        }
    }
}