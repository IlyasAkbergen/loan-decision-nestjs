export class Term {
    constructor(
        public readonly months: number,
    ) {}

    static fromMonths(months: number): Term {
        if (months <= 0) {
            throw new Error('Term must be a positive number of months');
        }

        return new Term(months);
    }
}
