import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcAuthService } from './auth-grpc-client.service';
import { authClientFactory } from './auth-grpc-client.factory';

@Module({
  imports: [
    ClientsModule.registerAsync([authClientFactory]),
  ],
  providers: [GrpcAuthService],
  exports: [GrpcAuthService],
}) 
export class GrpcAuthModule {} 