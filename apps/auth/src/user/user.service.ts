import { Injectable, ForbiddenException } from '@nestjs/common';
import { UpdateUserRequest } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundError } from 'rxjs';
import { UserRoles } from '@app/common';
import { JwtPayload } from '../jwt/dtos/jwt-payload.dto';
import { IPaginationOptions, paginate } from 'nestjs-typeorm-paginate';


@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>  
  ){}

  async findAll(options: IPaginationOptions) {
    const queryBuilder = this.userRepository
      .createQueryBuilder('user')

      const paginatedResult = await paginate<User>(queryBuilder, {
        page: Number(options.page) || 1,
        limit: Number(options.limit) || 10,
      });
    
      return {
        users: paginatedResult.items,
        meta: {
          itemCount: paginatedResult.meta.itemCount,
          totalPages: paginatedResult.meta.totalPages,
          currentPage: paginatedResult.meta.currentPage
        }
      };  
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({where: {id: id}});

    if(!user)
      throw new NotFoundError("user not found.")

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserRequest, jwtPayload: JwtPayload) {
    if (jwtPayload.role === UserRoles.USER && jwtPayload.user_id !== id) {
      throw new ForbiddenException("You can only update your own profile");
    }

    await this.userRepository.update(id, updateUserDto);
    
    return this.findOne(id);
  }

  async remove(id: string, jwtPayload: JwtPayload) {
    if (jwtPayload.role === UserRoles.USER && jwtPayload.user_id !== id) {
      throw new ForbiddenException("You can only remove your own profile");
    }

    this.userRepository.remove(await this.findOne(id));

    return { message: 'User deleted successfully' };
  }
}

