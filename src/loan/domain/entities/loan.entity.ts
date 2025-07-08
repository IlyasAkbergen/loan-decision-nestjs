import { UUID } from "crypto";

export class Loan {
  constructor(
    public readonly id: UUID,
    public readonly client: Client,
    public readonly product: Product,
    public readonly termMonth: number,
    public readonly amount: number,
    public readonly interestRate: number,
  ) {}
}