import { Transport } from '@nestjs/microservices';
import { join } from 'path';
import { SCORE_PACKAGE_NAME, SCORE_SERVICE_NAME } from '../../types/proto-types/score';

export const scoreClientFactory = {
  name: SCORE_SERVICE_NAME,
  useFactory: () => ({
    transport: Transport.GRPC as const,
    options: {
      url: 'score:' + 4001,
      package: SCORE_PACKAGE_NAME,
      protoPath: join(__dirname, '../score.proto'),
    },
  }),
}; 