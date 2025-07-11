export class InterestRate {
    constructor(
        public readonly value: number,
    ) {
        if (value < 0 || value > 100) {
            throw new Error('Interest rate must be between 0 and 100');
        }
    }

    public increaseBy(percentage: number): InterestRate {
        return new InterestRate(this.value + percentage);
    }

    public getValue(): number {
        return this.value;
    }
}
