import { NestFactory } from '@nestjs/core';
import { ProductModule } from './products/product.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { MicroserviceOptions } from '@nestjs/microservices';
import { GET_PRODUCTS_DETAILS_PACKAGE_NAME, ErrorLoggerFilter, RabbitMQService } from '@app/common';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(ProductModule);

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new ErrorLoggerFilter(app.get(RabbitMQService)));

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      url: '0.0.0.0:' + 4002,
      package: GET_PRODUCTS_DETAILS_PACKAGE_NAME,
      protoPath: join(__dirname, '../get-products-details.proto'),
    },
  });

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
