export enum Decision {
    APPROVED = 'approved',
    APPROVED_WITH_CHANGES = 'approved_with_changes',
    DENIED = 'denied',
}

export enum RuleCode {
    CREDIT_RATING = 'credit_rating',
    INCOME = 'income',
    AGE = 'age',
    STATE_EXCLUSIVE = 'state_exclusive',
    STATE_NY_RANDOM = 'state_ny_random',
    STATE_CA_INTEREST_INCREASE = 'state_ca_interest_increase',
    DUMP = 'dump',
}
