import { FullName } from '../value-objects/full-name.value-object';
import { Age } from '../value-objects/age.value-object';
import { CreditScore } from '../value-objects/credit-score.value-object';
import { Income } from '../value-objects/income.value-object';
import { USState } from '../enums/enums';

export class Client {
    constructor(
        public readonly id: string,
        public readonly fullName: FullName,
        public readonly dateOfBirth: Date,
        public readonly creditScore: CreditScore,
        public readonly monthlyIncome: Income,
        public readonly state: USState,
    ) {}

    public isAdult(): boolean
    {
        return this.getAge().isEqualOrGreaterThan(18)
    }

    public isSenior(): boolean
    {
        return this.getAge().isGreaterThan(60);
    }

    public getAge(): Age
    {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        
        return new Age(age);
    }

    public hasSufficientCreditScore(minScore: number): boolean
    {
        return this.creditScore.isGreaterThan(minScore);
    }
}
