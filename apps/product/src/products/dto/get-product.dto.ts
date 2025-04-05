import { Expose } from "class-transformer";

export class GetProductResponse {
    @Expose()
    id: string;

    @Expose()
    name: string;

    @Expose()
    price: number;

    @Expose()
    description?: string;

    @Expose()
    discountPercentage: number;
}
