import { RuleCode } from "../enums/enums";
import { RuleInterface } from "../services/decision-maker/rule-interface";

export interface RulesRepository {
    findByCodes(codes: RuleCode[]): RuleInterface[];
}
