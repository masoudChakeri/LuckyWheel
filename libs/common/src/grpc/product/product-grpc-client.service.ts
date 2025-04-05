import { GET_PRODUCTS_DETAILS_SERVICE_NAME, GetProductsDetailsRequest } from '@app/common/types/proto-types/get-products-details';
import { GetProductsDetailsResponse } from '@app/common/types/proto-types/get-products-details';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { GetProductsDetailsServiceClient } from '@app/common/types/proto-types/get-products-details';
import { Observable } from 'rxjs';

@Injectable()
export class GrpcProductService implements GetProductsDetailsServiceClient {
    private productService: GetProductsDetailsServiceClient;


    constructor(
        @Inject(GET_PRODUCTS_DETAILS_SERVICE_NAME)
        private readonly client: ClientGrpc,
      ) {
        this.productService = this.client.getService<GetProductsDetailsServiceClient>(GET_PRODUCTS_DETAILS_SERVICE_NAME);
      }

      getProductsDetails(request: GetProductsDetailsRequest): Observable<GetProductsDetailsResponse> {
        return this.productService.getProductsDetails(request);
      }
} 