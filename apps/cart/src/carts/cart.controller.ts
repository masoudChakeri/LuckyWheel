import { Controller, Get, Post, Body, Param, Delete, Put, Headers, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartRequest } from './dto/create-cart.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('cart')
// @UseGuards(AuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Put('/add/:user_id')
  create(@Body() createCartDto: CreateCartRequest,
   @Param('user_id') user_id: string) {
    return this.cartService.create(createCartDto, user_id);
  }

  @Get('/:user_id')
  findAll(@Param('user_id') user_id: string) {
    return this.cartService.findAll(user_id);
  }

  @Delete('/:user_id')
  remove(@Param('user_id') user_id: string, @Body() product_id: string) {
    return this.cartService.remove(user_id, product_id);
  }

  @Post('pay/:user_id')
  pay(@Param('user_id') userId: string,
      @Headers('authorization') token: string) {
    return this.cartService.pay(userId, token);
  }
}
