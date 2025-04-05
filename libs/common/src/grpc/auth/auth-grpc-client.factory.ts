import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { TOKEN_VALIDATION_PACKAGE_NAME, TOKEN_VALIDATION_SERVICE_NAME } from '../../types/proto-types/validate-token';

export const authClientFactory = {
  name: TOKEN_VALIDATION_SERVICE_NAME,
  useFactory: () => ({
    transport: Transport.GRPC as const,
    options: {
      url: 'auth:' + 4000,
      package: TOKEN_VALIDATION_PACKAGE_NAME,
      protoPath: join(__dirname, '../validate-token.proto'),
    },
  }),
}; 