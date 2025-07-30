import { IsString, IsEnum, IsNumber, IsDateString, Min, Max, IsNotEmpty } from 'class-validator';
import { USState } from '../domain/enums/enums';

export class CreateClientDto {
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsDateString()
    dateOfBirth: string;

    @IsNumber()
    @Min(300)
    @Max(850)
    creditScore: number;

    @IsNumber()
    @Min(0)
    monthlyIncome: number;

    @IsEnum(USState)
    state: USState;
}
