import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { ErrorLoggerFilter, TOKEN_VALIDATION_PACKAGE_NAME, RabbitMQService } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true 
  }));
  
  app.useGlobalFilters(new ErrorLoggerFilter(app.get(RabbitMQService)));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:' + 4000,
      package: TOKEN_VALIDATION_PACKAGE_NAME,
      protoPath: join(__dirname, '../validate-token.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
