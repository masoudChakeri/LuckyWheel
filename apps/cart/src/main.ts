import { NestFactory } from '@nestjs/core';
import { CartModule } from './carts/cart.module';
import { ValidationPipe } from '@nestjs/common';
import { ErrorLoggerFilter, RabbitMQService } from '@app/common';
async function bootstrap() {
  const app = await NestFactory.create(CartModule);

  app.useGlobalPipes(new ValidationPipe({ 
    whitelist: true, 
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useGlobalFilters(new ErrorLoggerFilter(app.get(RabbitMQService)));

  await app.startAllMicroservices();
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
