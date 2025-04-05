import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';
import { JwtService } from '../jwt/jwt.service';
import { JwtStrategy } from '../jwt/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ErrorLoggerFilter, RabbitMQService } from '@app/common';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './apps/auth/.env'
    }),

    TypeOrmModule.forFeature([User]),
    
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
  }),],
  
  controllers: [UserController],
  providers: [UserService, AuthGuard, JwtStrategy, JwtService, ErrorLoggerFilter,RabbitMQService],
})
export class UserModule {}
