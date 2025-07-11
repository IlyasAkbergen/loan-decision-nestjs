import { RuleCode } from "src/loan/domain/enums/enums";
import { RulesRepository } from "src/loan/domain/repositories/rule.repository";
import { RuleInterface } from "src/loan/domain/services/decision-maker/rule-interface";

export class RuleRegistry implements RulesRepository {
    private rules: Map<string, RuleInterface>;

    constructor() {
        this.rules = new Map<string, RuleInterface>();
    }

    registerRule(rule: RuleInterface): void {
        this.rules.set(rule.getCode(), rule);
    }

    findByCodes(codes: RuleCode[]): RuleInterface[] {
        return codes.map(code => this.rules.get(code)).filter(rule => rule !== undefined) as RuleInterface[];
    }
}
