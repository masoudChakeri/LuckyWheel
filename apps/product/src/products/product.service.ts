import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product.dto';
import { Product } from './entities/product.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { UpdateProductRequest } from './dto/update-product.dto';
import { GetProductsDetailsResponse, ProductDetails} from '@app/common/types/proto-types/get-products-details';
import { GetProductsDetailsRequest } from '@app/common/types/proto-types/get-products-details';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductRequest) {
    return this.productRepository.save(createProductDto);
  }

  async findAll(options: IPaginationOptions) {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')

      const paginatedResult = await paginate<Product>(queryBuilder, {
        page: Number(options.page) || 1,
        limit: Number(options.limit) || 10,
      });

    return {
      products: paginatedResult.items,
      meta: {
        itemCount: paginatedResult.meta.itemCount,
        totalPages: paginatedResult.meta.totalPages,
        currentPage: paginatedResult.meta.currentPage
      }
    }; 
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductRequest) {
    const product = await this.productRepository.preload({
      id,
      ...updateProductDto
    });
    
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.productRepository.save(product);
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.productRepository.delete(id);

    return { message: 'Product deleted successfully' };
  }


  async getProductsDetails(request: GetProductsDetailsRequest):
  Promise<GetProductsDetailsResponse> {
    try {
      const products = await this.productRepository.find({
        where: { id: In(request.productIds) }
      });

      const productDetails: ProductDetails[] = products.map(product => ({
        productId: product.id,
        name: product.name,
        description: product.description ?? "",
        price: product.price,
        discountPercentage: product.discountPercentage ?? 0
      }));

      return {
        productDetails
      };
    } catch (error) {
      throw error;
    }
  }
}
