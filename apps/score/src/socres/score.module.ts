import { Module } from '@nestjs/common';
import { ScoreService } from './score.service';
import { ScoreController } from './score.controller';
import { ConfigModule } from '@nestjs/config';
import { Score } from './entities/score.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { GrpcAuthModule } from '@app/common';
import { ErrorLoggerFilter, RabbitMQService } from '@app/common';

@Module({
  imports: [
    GrpcAuthModule,
    TypeOrmModule.forFeature([Score]),
    ScheduleModule.forRoot(),

    ConfigModule.forRoot({
      envFilePath: './apps/product/.env'
    }),

    
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.Score_DB_HOST,
      port: parseInt(process.env.Score_DB_PORT ?? '5432'),
      username: process.env.Score_DB_USERNAME,
      password: process.env.Score_DB_PASSWORD?.toString(),
      database: process.env.Score_DB_NAME,
      entities: [Score],
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true,
    }),    
  ],
  providers: [ScoreService, ErrorLoggerFilter, RabbitMQService],
  controllers: [ScoreController],
})
export class ScoreModule {}
