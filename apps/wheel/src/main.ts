import { NestFactory } from '@nestjs/core';
import { WheelModule } from './wheel/wheel.module';
import { RabbitMQService } from '@app/common';
import { ErrorLoggerFilter } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(WheelModule);
  app.useGlobalFilters(new ErrorLoggerFilter(app.get(RabbitMQService)));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
