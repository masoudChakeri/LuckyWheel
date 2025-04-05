import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtService } from '../jwt/jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { User } from '../user/entities/user.entity';
import { SeederService } from '../seeder/seeder.service';
import { UserModule } from '../user/user.module';
import { ErrorLoggerFilter, RabbitMQService, GrpcScoreModule } from '@app/common';


@Module({
  imports: [
    GrpcScoreModule,

    ConfigModule.forRoot({
      envFilePath: './apps/auth/.env'
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.Auth_DB_HOST,
      port: parseInt(process.env.Auth_DB_PORT ?? '5432'),
      username: process.env.Auth_DB_USERNAME,
      password: process.env.Auth_DB_PASSWORD?.toString(),
      database: process.env.Auth_DB_NAME,
      entities: [User],
      // synchronize: process.env.NODE_ENV !== 'production',
      synchronize: true,
    }),

    UserModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),

  ],
  providers: [AuthService, JwtStrategy, JwtService, SeederService, ErrorLoggerFilter,RabbitMQService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
