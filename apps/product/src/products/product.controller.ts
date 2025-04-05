import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductRequest } from './dto/create-product.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { GetProductResponse } from './dto/get-product.dto';
import { GetAllProductsResponse } from './dto/get-all-prodocts.dto';
import { Serialize } from '../decorators/serialize.decorator';
import { UpdateProductRequest } from './dto/update-product.dto';
import { UserRoles } from '@app/common';
import { GetProductsDetailsResponse, GetProductsDetailsServiceControllerMethods } from '@app/common/types/proto-types/get-products-details';
import { GetProductsDetailsServiceController } from '@app/common/types/proto-types/get-products-details';
import { GetProductsDetailsRequest } from '@app/common/types/proto-types/get-products-details';

@Controller('product')
@GetProductsDetailsServiceControllerMethods()
export class ProductController implements GetProductsDetailsServiceController {
  constructor(private readonly productService: ProductService) {}
 
  async getProductsDetails(request: GetProductsDetailsRequest):
   Promise<GetProductsDetailsResponse> {
    return await this.productService.getProductsDetails(request);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  @Serialize(GetProductResponse)
  create(@Body() createProductDto: CreateProductRequest) {
    return this.productService.create(createProductDto);
  }

  @Get()
  @UseGuards(AuthGuard)
  @Serialize(GetAllProductsResponse)
  findAll(@Query() options: IPaginationOptions) {
    return this.productService.findAll(options);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @Serialize(GetProductResponse)
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductRequest) {
    return this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @Roles(UserRoles.ADMIN)
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}
