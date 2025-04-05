import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { GrpcProductModule } from '@app/common/grpc/product/product-grpc.module';
import { GrpcScoreModule } from '@app/common/grpc/score/score-grpc.module';
import { GrpcAuthModule } from '@app/common/grpc/auth/auth-grpc.module';
import { RabbitMQService } from '@app/common';
import { ErrorLoggerFilter } from '@app/common';


@Module({
  imports: [
    GrpcAuthModule,
    GrpcProductModule,
    GrpcScoreModule,
    TypeOrmModule.forFeature([Cart]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.Cart_DB_HOST,
      port: parseInt(process.env.Cart_DB_PORT ?? '5432'),
      username: process.env.Cart_DB_USERNAME,
      password: process.env.Cart_DB_PASSWORD?.toString(),
      database: process.env.Cart_DB_NAME,
      entities: [Cart],
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true,
    }),
  ],
  controllers: [CartController],
  providers: [CartService, ErrorLoggerFilter,RabbitMQService],
})
export class CartModule {}
