import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { 
  ScoreServiceClient, 
  AddScoreRequest, 
  AddScoreResponse,
  GetScoreRequest,
  GetScoreResponse,
  SCORE_SERVICE_NAME
} from '../../types/proto-types/score';
import { Observable } from 'rxjs';

@Injectable()
export class GrpcScoreService implements ScoreServiceClient {
  private scoreService: ScoreServiceClient;

  constructor(
    @Inject(SCORE_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {
    this.scoreService = this.client.getService<ScoreServiceClient>(SCORE_SERVICE_NAME);
  }

  addScore(request: AddScoreRequest): Observable<AddScoreResponse> {
    return this.scoreService.addScore(request);
  }

  getScore(request: GetScoreRequest): Observable<GetScoreResponse> {
    return this.scoreService.getScore(request);
  }
} 