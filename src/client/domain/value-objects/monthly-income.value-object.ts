export class MonthlyIncome {
    constructor(
        public readonly value: number,
    ) {
        if (value < 0) {
            throw new Error('Monthly income cannot be negative');
        }
    }

    public isGreaterThanOrEqualTo(value: number): boolean {
        return this.value >= value;
    }

    public getValue(): number {
        return this.value;
    }
}
