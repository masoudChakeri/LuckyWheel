import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsNotEmpty } from "class-validator";

export class CreateCartRequest {
    @IsNotEmpty()
    product_id: string;

    @IsNotEmpty()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    quantity: number;
}
