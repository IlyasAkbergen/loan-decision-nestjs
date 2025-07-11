export class Age {
    constructor(
        public readonly value: number,
    ) {
        if (value < 0 || value > 150) {
            throw new Error('Age must be between 0 and 150');
        }
    }

    public isEqualOrGreaterThan(value: number): boolean
    {
        return this.value >= value;
    }

    public isLessOrEqualThan(value: number): boolean
    {
        return this.value <= value;
    }

    public isGreaterThan(age: number): boolean
    {
        return this.value > age;
    }
}
