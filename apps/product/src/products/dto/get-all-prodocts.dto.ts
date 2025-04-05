import { Expose, Type } from "class-transformer";
import { GetProductResponse } from "./get-product.dto";

export class GetAllProductsResponse {
    @Expose()
    @Type(() => GetProductResponse)
    products: GetProductResponse[];

    @Expose()
    meta: {
        itemCount: number;
        totalPages: number;
        currentPage: number;
    }
}