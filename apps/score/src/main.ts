import { NestFactory } from '@nestjs/core';
import { ScoreModule } from './socres/score.module';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ErrorLoggerFilter, RabbitMQService, SCORE_PACKAGE_NAME } from '@app/common';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(ScoreModule);

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new ErrorLoggerFilter(app.get(RabbitMQService)));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:' + 4001,
      package: SCORE_PACKAGE_NAME,
      protoPath: join(__dirname, '../score.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
