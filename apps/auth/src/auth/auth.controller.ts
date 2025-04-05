import { Controller, Post, Body, Get, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/user-register.dto';
import { TokenValidationServiceController, TokenValidationServiceControllerMethods, TokenValidationRequest, TokenValidationResponse } from '@app/common';
import { Serialize } from '../decorators/serialize.decorator';
import { LoginResponse } from './dto/login-response.dto';


@Controller('auth')
@TokenValidationServiceControllerMethods()
export class AuthController implements TokenValidationServiceController {
  constructor(private authService: AuthService) {}
  
  @Post('register')
  @Serialize(LoginResponse)
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto.phone, createUserDto.password, createUserDto.inviteCode);
  }
  
  @Post('login')
  @Serialize(LoginResponse)
  async login(@Body() loginDto: CreateUserDto) {
    return await this.authService.login(loginDto.phone, loginDto.password);
  }

  @Get('test')
  throwInternalError() {
    throw new Error('Internal Server Error');
  }
  
  async validateToken(request: TokenValidationRequest): Promise<TokenValidationResponse> {
    const response = await this.authService.validateTokenForGrpc(request.token);
    return response;
  }
}
