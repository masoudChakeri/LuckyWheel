import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { GrpcScoreService } from './score-grpc-client.service';
import { scoreClientFactory } from './score-grpc-client.factory';

@Module({
  imports: [
    ClientsModule.registerAsync([scoreClientFactory]),
  ],
  providers: [GrpcScoreService],
  exports: [GrpcScoreService],
}) 
export class GrpcScoreModule {} 