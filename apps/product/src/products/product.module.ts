import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Product } from './entities/product.entity';
import { GrpcAuthModule } from '@app/common';
import { ErrorLoggerFilter, RabbitMQService } from '@app/common';


@Module({
  imports: [
    GrpcAuthModule,
    
    ConfigModule.forRoot({
      envFilePath: './apps/product/.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.Product_DB_HOST,
      port: parseInt(process.env.Product_DB_PORT ?? '5434'),
      username: process.env.Product_DB_USERNAME,
      password: process.env.Product_DB_PASSWORD?.toString(),
      database: process.env.Product_DB_NAME,
      entities: [Product],
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true,
    }),

    TypeOrmModule.forFeature([Product]),
  ],
  controllers: [ProductController],
  providers: [ProductService, ErrorLoggerFilter,RabbitMQService],
})
export class ProductModule {}
