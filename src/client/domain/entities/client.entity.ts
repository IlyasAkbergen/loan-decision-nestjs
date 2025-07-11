import { FullName } from '../value-objects/full-name.value-object';
import { Age } from '../value-objects/age.value-object';
import { CreditScore } from '../value-objects/credit-score.value-object';
import { MonthlyIncome } from '../value-objects/monthly-income.value-object';
import { USState } from '../enums/enums';

export class Client {
    constructor(
        public readonly id: string,
        public readonly fullName: FullName,
        public readonly age: Age,
        public readonly creditScore: CreditScore,
        public readonly monthlyIncome: MonthlyIncome,
        public readonly state: USState,
    ) {}

    public isAdult(): boolean
    {
        return this.age.isEqualOrGreaterThan(18)
    }

    public isSenior(): boolean
    {
        return this.age.isGreaterThan(60);
    }

    public hasSufficientCreditScore(minScore: number): boolean
    {
        return this.creditScore.isGreaterThan(minScore);
    }
}
