import { LoanDecision } from "../../aggregate/loan-decision.aggregate";
import { RuleCode } from "../../enums/enums";

export interface RuleInterface {
    apply(decision: LoanDecision): void
    getCode(): RuleCode;
}
