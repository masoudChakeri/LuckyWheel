import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { 
  GET_PRODUCTS_DETAILS_PACKAGE_NAME,
  GET_PRODUCTS_DETAILS_SERVICE_NAME }
   from '@app/common/types/proto-types/get-products-details';


export const productClientFactory = {
  name: GET_PRODUCTS_DETAILS_SERVICE_NAME,
  useFactory: () => ({
    transport: Transport.GRPC as const,
    options: {
      url: 'product:' + 4002,
      package: GET_PRODUCTS_DETAILS_PACKAGE_NAME,
      protoPath: join(__dirname, '../get-products-details.proto'),
    },
  }),
}; 