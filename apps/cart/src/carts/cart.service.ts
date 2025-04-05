import { BadRequestException, Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { CreateCartRequest } from './dto/create-cart.dto';
import { GrpcProductService } from '@app/common/grpc/product/product-grpc-client.service';
import { GrpcScoreService } from '@app/common/grpc/score/score-grpc-client.service';


@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    private readonly grpcProductService: GrpcProductService,
    private readonly grpcScoreService: GrpcScoreService,
  ) {}


  async create(createCartDto: CreateCartRequest, user_id: string) {
    const item = await this.findWithProductAndUserId(
      createCartDto.product_id, user_id);

      const productDetailsResponse = await this.getProductDetails(
        [createCartDto.product_id]);

      const total_price = productDetailsResponse.productDetails[0].price 
            * createCartDto.quantity;

      if (item) {
          if(item.quantity + createCartDto.quantity < 1){
            throw new BadRequestException('Quantity must be greater than 0');
          }
          
          item.quantity += createCartDto.quantity;
          item.total_price += total_price;
          return await this.cartRepository.save(item);
      }else{
          const cart = this.cartRepository.create({
            ...createCartDto,
            total_price: total_price,
            user_id: user_id
      });
      await this.cartRepository.save(cart);
      
      return {
        id: cart.id,
        name: productDetailsResponse.productDetails[0].name,
        price: productDetailsResponse.productDetails[0].price,
        description: productDetailsResponse.productDetails[0].description,
        discountPercentage: productDetailsResponse.productDetails[0].discountPercentage,
        quantity: cart.quantity,
        total_price: cart.total_price
      };
    }
  }
  
  async findAll(user_id: string) {
    const carts = await this.cartRepository.find({ where: {user_id: user_id} });
    if(carts.length === 0){
      return [];
    }

    const product_ids = carts.map(cart => cart.product_id);

    return (await this.getProductDetails(product_ids)).productDetails.map(product => ({
      id: product.productId,
      name: product.name,
      price: product.price,
      description: product.description,
      discountPercentage: product.discountPercentage,
      quantity: carts.find(cart => cart.product_id === product.productId)?.quantity,
      total_price: carts.find(cart => cart.product_id === product.productId)?.total_price
    }));
  }


  async remove(user_id: string, product_id: string) {
    const item = await this.findWithProductAndUserId(product_id, user_id);
    if(!item){
      throw new BadRequestException('Item not found');
    }

    await this.cartRepository.delete(item);

    return { message: 'cart removed is empty now.' };
  }

  async pay(user_id: string, token: string) {
    const cart = await this.cartRepository.find({ where: {user_id: user_id} });

    if(cart.length === 0){
      throw new BadRequestException('Cart is empty');
    }

    const total_price = cart.reduce((acc, item) => acc + item.total_price, 0);

    await this.sendScore(user_id, total_price, token);
    await this.cartRepository.remove(cart);

    return total_price;
  }

  private async sendScore(user_id: string, total_price: number, token: string) {
    try {
      const scoreResponse = await firstValueFrom(
        this.grpcScoreService.addScore({
          userId: user_id,
          score: this.calculateScore(total_price),
          token: token.replace('Bearer ', '')
        })
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to add score | cart service', error);
    }
  }

  private calculateScore(total_price: number) : number {
    if (total_price >= Number(process.env.PURCHASE_SCORE_THRESHOLD_100) 
      && total_price < Number(process.env.PURCHASE_SCORE_THRESHOLD_200)) {
      return 1;
    } else if (total_price >= Number(process.env.PURCHASE_SCORE_THRESHOLD_200)) {
      return 2;
    }else{
      return 0;
    }
  }


  private async getProductDetails(product_ids: string[]) {
    const productDetails = await firstValueFrom(
      this.grpcProductService.getProductsDetails({productIds: product_ids}));
      
    return productDetails;
  }

  private async findWithProductAndUserId(product_id: string, user_id: string) {
    return await this.cartRepository.findOne({ where: {
      product_id: product_id,
      user_id: user_id
    }});
  }
}
