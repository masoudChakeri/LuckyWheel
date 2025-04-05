import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class CreateProductRequest {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    price: number;

    @IsOptional()
    description: string;

    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    discountPercentage: number;
}
