export enum USState {
    CA = 'CA',
    NY = 'NY', 
    NV = 'NV',
    TX = 'TX',
    FL = 'FL',
}

export class State {
    constructor(
        public readonly value: USState,
    ) {}

    public isOneOf(states: USState[]): boolean {
        return states.includes(this.value);
    }

    public equals(state: USState): boolean {
        return this.value === state;
    }

    public getValue(): USState {
        return this.value;
    }
}
