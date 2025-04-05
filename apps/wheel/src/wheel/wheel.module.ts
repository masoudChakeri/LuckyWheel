import { Module } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { WheelController } from './wheel.controller';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prize } from './entities/prize.entity';
import { GrpcScoreModule, GrpcAuthModule, ErrorLoggerFilter, RabbitMQService } from '@app/common';
import { SeederService } from '../seeder/seeder.service';
import { UserWonPrize } from './entities/user-won-prize.entity';


@Module({
  imports: [
    GrpcScoreModule,
    GrpcAuthModule,

    ConfigModule.forRoot({
      envFilePath: './apps/product/.env'
    }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.Wheel_DB_HOST,
      port: parseInt(process.env.Wheel_DB_PORT ?? '5432'),
      username: process.env.Wheel_DB_USERNAME,
      password: process.env.Wheel_DB_PASSWORD?.toString(),
      database: process.env.Wheel_DB_NAME,
      entities: [UserWonPrize, Prize],
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true,
    }),

    TypeOrmModule.forFeature([UserWonPrize, Prize]),
  ],

  controllers: [WheelController],
  providers: [WheelService, SeederService, ErrorLoggerFilter, RabbitMQService],
})
export class WheelModule {}
