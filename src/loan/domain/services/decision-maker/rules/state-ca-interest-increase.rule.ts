import { LoanDecision } from "src/loan/domain/aggregate/loan-decision.aggregate";
import { Decision, RuleCode } from "src/loan/domain/enums/enums";
import { RuleInterface } from "../rule-interface";
import { USState } from "src/client/domain/enums/enums";

export class StateCaInterestIncreaseRule implements RuleInterface {
    private readonly CA_INTEREST_INCREASE = 11.49;

    apply(decision: LoanDecision): void {
        if (decision.client.state && decision.client.state === USState.CA) {
            // Увеличиваем процентную ставку для клиентов из Калифорнии
            decision.increaseInterestRate(this.CA_INTEREST_INCREASE);
        }
    }

    getCode(): RuleCode {
        return RuleCode.STATE_CA_INTEREST_INCREASE;
    }
}
