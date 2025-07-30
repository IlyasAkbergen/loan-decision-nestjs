import { Inject, Injectable } from "@nestjs/common";
import { RuleCode } from "src/loan/domain/enums/enums";
import { RulesRepository } from "src/loan/domain/repositories/rule.repository";
import { RuleInterface } from "src/loan/domain/services/decision-maker/rule-interface";

@Injectable()
export class RuleRegistry implements RulesRepository {
    private rules: Map<RuleCode, RuleInterface>;

    constructor(
        @Inject('RULES') rules: RuleInterface[],
    ) {
        this.rules = new Map(
            rules.map(rule => [rule.getCode(), rule])
        );
    }

    findByCodes(codes: RuleCode[]): Promise<RuleInterface[]>
    {
        const rules = codes
            .map(code => this.rules.get(code))
            .filter((rule): rule is RuleInterface => rule !== undefined);
        
        return Promise.resolve(rules);
    }
}
