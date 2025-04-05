import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, UseGuards } from '@nestjs/common';
import { WheelService } from './wheel.service';
import { AuthGuard } from '../guards/auth.guard';

@Controller('wheel')
export class WheelController {
  constructor(private readonly wheelService: WheelService) {}

  @Get('available/:user_id')
  @UseGuards(AuthGuard)
  async getAvailablePrizes(@Param('user_id') userId: string) {
    return await this.wheelService.getAvailablePrizes(userId);
  }

  @Get('won/:user_id')
  @UseGuards(AuthGuard)
  async getWonPrizes(@Param('user_id') userId: string) {
    return await this.wheelService.getWonPrizes(userId);
  }

  @Get('spin/:user_id')
  @UseGuards(AuthGuard)
  spin(@Param('user_id') userId: string,
    @Headers("Authorization") token: string) {
    return this.wheelService.spin(userId, token);
  }
}
