// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               v6.30.1
// source: proto/score.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackageScore = "score";

export interface AddScoreRequest {
  userId: string;
  score: number;
  token: string;
}

export interface AddScoreResponse {
  userId: string;
  score: number;
}

export interface GetScoreRequest {
  userId: string;
}

export interface GetScoreResponse {
  userId: string;
  score: number;
}

export const SCORE_PACKAGE_NAME = "score";

export interface ScoreServiceClient {
  addScore(request: AddScoreRequest): Observable<AddScoreResponse>;

  getScore(request: GetScoreRequest): Observable<GetScoreResponse>;
}

export interface ScoreServiceController {
  addScore(request: AddScoreRequest): Promise<AddScoreResponse> | Observable<AddScoreResponse> | AddScoreResponse;

  getScore(request: GetScoreRequest): Promise<GetScoreResponse> | Observable<GetScoreResponse> | GetScoreResponse;
}

export function ScoreServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["addScore", "getScore"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("ScoreService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("ScoreService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const SCORE_SERVICE_NAME = "ScoreService";
