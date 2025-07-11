export class CreditScore {
    constructor(
        public readonly value: number,
    ) {
        if (value < 300 || value > 850) {
            throw new Error('Credit score must be between 300 and 850');
        }
    }

    public isGreaterThan(value: number): boolean {
        return this.value > value;
    }

    public getValue(): number {
        return this.value;
    }
}
