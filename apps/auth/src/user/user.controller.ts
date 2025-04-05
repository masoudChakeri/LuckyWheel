import { Controller, Get, Body, Patch, Param, Delete, UseInterceptors, UseGuards, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserRequest } from './dto/update-user.dto';
import { GetUserResponse } from './dto/get-user.dto';
import { AuthGuard } from '../guards/auth.guard';
import { Roles } from '../decorators/roles.decorator';
import { UserRoles } from '@app/common';
import { JwtPayload } from '../jwt/dtos/jwt-payload.dto';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Serialize } from '../decorators/serialize.decorator';
import { GetAllUsersResponse } from './dto/get-all-users.dto';


@Controller('user')
@UseGuards(AuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(UserRoles.ADMIN)
  @Serialize(GetAllUsersResponse)
  async findAll(@Query() options: IPaginationOptions) {
    return await this.userService.findAll(options);
  }

  @Get(':id')
  @Roles(UserRoles.ADMIN)
  @Serialize(GetUserResponse)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  @Serialize(GetUserResponse)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequest, @Req() req: { user: JwtPayload }) {
    return this.userService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRoles.ADMIN, UserRoles.USER)
  remove(@Param('id') id: string, @Req() req: { user: JwtPayload }) {
    return this.userService.remove(id, req.user);
  }
}
