import { IsString, IsEnum, IsNumber, IsPositive, Min, Max } from 'class-validator';
import { ProductCode } from '../domain/enums/product-code.enum';

export class CreateProductDto {
    @IsString()
    name: string;

    @IsEnum(ProductCode)
    code: ProductCode;

    @IsNumber()
    @IsPositive()
    termMonths: number;

    @IsNumber()
    @Min(0)
    @Max(100)
    interestRate: number;

    @IsNumber()
    @IsPositive()
    sum: number;
}
