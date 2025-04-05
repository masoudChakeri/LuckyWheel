import { IsOptional, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateCartRequest {
    @IsOptional()
    @IsNumber()
    @Transform(({ value }) => Number(value))
    quantity: number;
}
