import { RuleCode } from "src/loan/domain/enums/enums";
import { RuleRegistry } from "./rule.registry";
import { RuleInterface } from "src/loan/domain/services/decision-maker/rule-interface";
import { IncomeRule } from "src/loan/domain/services/decision-maker/rules/income.rule";
import { CreditScoreRule } from "src/loan/domain/services/decision-maker/rules/credit-score.rule";
import { AgeRule } from "src/loan/domain/services/decision-maker/rules/age.rule";
import { StateCaInterestIncreaseRule } from "src/loan/domain/services/decision-maker/rules/state-ca-interest-increase.rule";
import { StateExclusiveRule } from "src/loan/domain/services/decision-maker/rules/state-exclusive.rule";
import { StateNyRandomRule } from "src/loan/domain/services/decision-maker/rules/state-ny-random.rule";

describe('RuleRegistry', () => {
    let ruleRegistry: RuleRegistry;
    let rules: RuleInterface[];

    beforeEach(() => {
        rules = [
            new IncomeRule(),
            new CreditScoreRule(),
            new AgeRule(),
            new StateCaInterestIncreaseRule(),
            new StateExclusiveRule(),
            new StateNyRandomRule(),
        ];
        ruleRegistry = new RuleRegistry(rules);
    });

    it('should find rules by codes', () => {
        const foundRules = ruleRegistry.findByCodes([
            RuleCode.INCOME,
            RuleCode.AGE,
        ]);
        expect(foundRules.length).toBe(2);
        expect(foundRules).toContain(rules[0]);
        expect(foundRules).toContain(rules[2]);
    });
});
