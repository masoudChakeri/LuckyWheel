import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prize } from './entities/prize.entity';
import { UserWonPrize } from './entities/user-won-prize.entity';
import { GrpcScoreService } from '@app/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WheelService {

  constructor(
    private readonly grpcScoreService: GrpcScoreService,

    @InjectRepository(Prize)
    private prizeRepository: Repository<Prize>,

    @InjectRepository(UserWonPrize)
    private userWonPrizeRepository: Repository<UserWonPrize>,
  ) { }


  async getAvailablePrizes(userId: string): Promise<Prize[]> {
    // const userWonPrizes = await this.userWonPrizeRepository.find({
    //   where: {
    //     user_id: userId,
    //     prize: {
    //       justOnce: true
    //     }
    //   }
    // });
    // const allPrizes = await this.prizeRepository.find();

    // if (userWonPrizes === null) {
    //   return allPrizes;
    // }
    return this.prizeRepository
    .createQueryBuilder('prize')
      .leftJoinAndSelect(
        'prize.userWonPrizes',
        'userWonPrize',
        'userWonPrize.user_id = :userId',
        { userId }
      )
      .where('prize.justOnce = false OR userWonPrize.id IS NULL')
      .getMany();

    // return allPrizes.filter(prize => !userWonPrizes.some(won => won.prize.id === prize.id));
  }

  async spin(userId: string, token: string) {
    if(!(await this.checkUserScore(userId))){
      throw new ForbiddenException("you don't have enough score to spin");
    };

    const availablePrizes = await this.getAvailablePrizes(userId);

    const prize = this.getRandomPrize(availablePrizes);

    await this.AddToWon(userId, prize, token);

    if (prize.score > 0) {
      await this.addScore(userId, prize.score, token);
    }
    await this.addScore(userId, -1, token);

    return prize;
  }

  async getWonPrizes(userId: string): Promise<Prize[]> {
    const won = await this.userWonPrizeRepository.find({ where: { user_id: userId } });
    return won.map(won => won.prize);
  }

  private getRandomPrize(prizes: Prize[]): Prize {
    const totalWeight = prizes.reduce((sum, item) => sum + Number(item.weight), 0);
    const random = Math.random() * totalWeight; 
    let cumulativeWeight = 0;
    
    for (const prize of prizes) {
      cumulativeWeight += Number(prize.weight); 
  
      if (random < cumulativeWeight) {
        return prize;
      }
    }
  
    return prizes[prizes.length - 1];
  }


  private async AddToWon(userId: string, prize: Prize, token: string) {
    const won = this.userWonPrizeRepository.create({
      user_id: userId,
      prize_id: prize.id,
    });

    await this.userWonPrizeRepository.save(won);
  }

  private async addScore(userId: string, score: number, token: string) {
    try {
      const response = await firstValueFrom(
        this.grpcScoreService.addScore({
          userId: userId,
        score: score,
        token: token.replace('Bearer ', '')
      })
    );
    } catch (error) {
      throw new InternalServerErrorException('Error adding score', error);
    }
  }

  private async checkUserScore(userId: string) {  
    try {
      const response = await firstValueFrom(
        this.grpcScoreService.getScore({ userId: userId })
      );
      if (response.score > 0) {
        return true;
      }
    } catch (error) {
      throw new InternalServerErrorException('Error checking user score', error);
    }

    return false;
  }
}
