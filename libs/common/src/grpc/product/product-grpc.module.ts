import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcProductService } from './product-grpc-client.service';
import { productClientFactory } from './product-grpc-client.factory';

@Module({
  imports: [
    ClientsModule.registerAsync([productClientFactory]),
  ],
  providers: [GrpcProductService],
  exports: [GrpcProductService],
}) 
export class GrpcProductModule {} 