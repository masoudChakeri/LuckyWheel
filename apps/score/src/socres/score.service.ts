import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { Redis } from 'ioredis';
import { Repository } from 'typeorm';
import { Score } from './entities/score.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Cron } from '@nestjs/schedule';
import { firstValueFrom } from 'rxjs';
import { GetScoreResponse, GrpcAuthService, TokenValidationResponse } from '@app/common';


@Injectable()
export class ScoreService implements OnModuleInit {
  private redisClient: Redis;

  constructor(
    private readonly grpcAuthService: GrpcAuthService,
    @InjectRepository(Score) private scoreRepository: Repository<Score>,
  ) {
    this.redisClient = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      retryStrategy: (times) => Math.min(times * 50, 2000),
    });
  }

  async onModuleInit() {
    try {
      await this.redisClient.ping();
    } catch (error) {
      throw new InternalServerErrorException('Redis connection failed | score service', error);
    }
  }

  async getScoreHttp(userId: string): Promise<{ userId: string; totalScore: number }> {
    const currentScore = await this.redisClient.hget(userId, 'totalScore') || 
                            this.getScoreFromDb(userId);

    return {
      userId,
      totalScore: Number(currentScore)
    };
  }
  
  async getScore(userId: string): Promise<GetScoreResponse> {
      const cachedScore = await this.redisClient.hget(userId, 'totalScore');
      
      if (cachedScore) {
        return {
          userId,
          score: Number(cachedScore)
        };
      }

      const score = await this.getScoreFromDb(userId);
      
      await this.redisClient.hmset(userId, {
        totalScore: score.toString(),
        dataChanged: "false"
      });

      return {
        userId,
        score: score
      };
  }

  async addScore(userId: string, score: number, token: string) {
    const tokenValidation = await this.tokenIsValid(token);
    if (!tokenValidation.isValid) {
      return { userId, totalScore: 0 };
    }

    const currentScore = await this.getScore(userId);
    const newScore = currentScore.score + score;

    await this.redisClient.hmset(
      userId,
      {
        totalScore: newScore.toString(),
        dataChanged: "true"
      }
    );

    return { userId, totalScore: newScore };
  }

  private async getScoreFromDb(userId: string): Promise<number> {
      const score = await this.scoreRepository.findOne({ where: { user_id: userId } });
      return score?.total_score ?? 0;
  }

  @Cron("*/1 * * * *")
  private async syncScores() {
    console.log("Running scheduled task to sync scores...");

    const keys = await this.redisClient.keys("*");

    for (const userId of keys) {
      const userData = await this.redisClient.hgetall(userId);

      if (userData.dataChanged === "true") {

        const score = await this.scoreRepository.findOne({ where: { user_id: userId } });

        if (!score) {
          await this.scoreRepository.save({
            user_id: userId,
            total_score: parseInt(userData.totalScore) || 0,
          });
        } else {
          await this.scoreRepository.update(
            { user_id: userId },
            { total_score: parseInt(userData.totalScore) || 0 }
          );
        }

        this.redisClient.del(userId);
        
        // await this.redisClient.hmset(userId, {
        //   totalScore: userData.totalScore.toString(),
        //   dataChanged: "false",
        // });
      }
    }
  }

  private async tokenIsValid(token: string): Promise<TokenValidationResponse> {
    try {
      const response = await firstValueFrom(
        this.grpcAuthService.validateToken({ token })
      );
      
      if (!response || !response.isValid) {
        return {
          isValid: false,
          userId: '',
          role: ''
        };
      }

      return response;
    } catch (error) {
      return {
        isValid: false,
        userId: '',
        role: ''
      };
    }
  }
}