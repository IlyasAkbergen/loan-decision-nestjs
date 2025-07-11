import { Client } from "../../../client/domain/entities/client.entity";
import { Product } from "../../../product/domain/entities/product.entity";
import { LoanConditions } from "../value-objects/loan-conditions.value-object";

export class Loan {
  constructor(
    public readonly id: string,
    public readonly client: Client,
    public readonly product: Product,
    public readonly conditions: LoanConditions,
    public readonly createdAt: Date,
  ) {}
}