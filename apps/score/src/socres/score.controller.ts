import { Controller, Post, Body, Get, Param, Headers, UseGuards } from '@nestjs/common';
import { AddScoreRequest, AddScoreResponse, GetScoreRequest, GetScoreResponse, ScoreServiceController, ScoreServiceControllerMethods, UserRoles } from '@app/common';
import { ScoreService } from './score.service';
import { AuthGuard } from '../guards/auth.guard';


@Controller('score')
@ScoreServiceControllerMethods()
export class ScoreController implements ScoreServiceController {
  constructor(private readonly scoreService: ScoreService) {}
  
  async addScore(request: AddScoreRequest): Promise<AddScoreResponse> {
    const result = await this.scoreService.addScore(request.userId, request.score, request.token);
    return {
      userId: result.userId,
      score: result.totalScore
    };
  }
  
  async getScore(request: GetScoreRequest): Promise<GetScoreResponse> {
    const result = await this.scoreService.getScore(request.userId);
    return {
      userId: result.userId,
      score: result.score
    };
  }
  
  @Get(':id')
  @UseGuards(AuthGuard)
  async get(@Param('id') userId: string) {
    const result = await this.scoreService.getScoreHttp(userId);
    return {
      score: result.totalScore
    };
  }
}
