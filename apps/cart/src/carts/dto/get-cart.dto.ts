import { Expose } from "class-transformer";

export class GetCartResponse{
    @Expose()       
    id: string;

    @Expose()
    name: string;

    @Expose()
    price: number;

    @Expose()
    description: string;

    @Expose()
    discountPercentage: number;

    @Expose()
    quantity: number;

    @Expose()
    total_price: number;
}