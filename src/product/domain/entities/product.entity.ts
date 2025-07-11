import { ProductCode } from "../enums/product-code.enum";
import { InterestRate } from "../value-objects/interest-rate.value-object";
import { Term } from "../value-objects/term.value-object";

export class Product {
    constructor(
        public id: string,
        public name: string,
        public code: ProductCode,
        public term: Term,
        public interestRate: InterestRate,
        public sum: number,
    ) {}
}
