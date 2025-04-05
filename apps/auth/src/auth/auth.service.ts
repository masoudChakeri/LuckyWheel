import { ConflictException, Inject, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '../jwt/jwt.service';
import { JwtPayload } from '../jwt/dtos/jwt-payload.dto';
import { UserRoles, TokenValidationResponse } from '@app/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { randomUUID } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { GrpcScoreService } from '@app/common/grpc/score/score-grpc-client.service';


@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly grpcScoreService: GrpcScoreService,
    @InjectRepository(User) private userRepository: Repository<User>
  ) {}
  
  async register(phone: string, password: string, inviteCode?: string) {
    if (await this.checkUserExists(phone)) {
      throw new ConflictException('Phone number already registered');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = this.userRepository.create({
      id: randomUUID(),
      password: hashedPassword,
      inviteCode: randomUUID(),
      phone: phone,
      role: UserRoles.USER
    });

    const token = this.jwtService.generateToken({ user_id: user.id, phone: user.phone, role: user.role });
    let isInviteCodeValid = false;

    if(inviteCode && inviteCode.length > 0){
      isInviteCodeValid = await this.isInviteCodeValid(inviteCode, token);
    }

    await this.userRepository.save(user);

    if(isInviteCodeValid){  
      await this.addScore(user.id, token);
    } 
    await this.addScore(user.id, token);

    return {
      "token": token,
      "user_id": user.id,
      "phone": user.phone,
      "role": user.role,
      "inviteCode": user.inviteCode
    }
  }

  async login(phone: string, password: string) {
      const user = await this.userRepository.findOne({
        where: { phone }
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      "token": this.jwtService.generateToken({ user_id: user.id, phone: user.phone, role: user.role }),
      "user_id": user.id,
      "phone": user.phone,
      "role": user.role,
      "inviteCode": user.inviteCode
    }
  }

  async validateTokenForGrpc(token: string): Promise<TokenValidationResponse> {
    try {
      if (!token) {
        return {
          isValid: false,
          userId: '',
          role: ''
        };
      }

      const decoded: JwtPayload = this.jwtService.verifyToken(token);
      
      const response: TokenValidationResponse = {
        isValid: true,
        userId: decoded.user_id,
        role: decoded.role
      };
      return response;
    } catch (error) {
      return {
        isValid: false,
        userId: '',
        role: ''
      };
    }
  }

  private async hashPassword(password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private async checkUserExists(phone: string) {
    const user = await this.userRepository.findOne({
      where: { phone: phone }
    });

    return !!user;
  }

  private async isInviteCodeValid(inviteCode: string, token: string) {
    const user = await this.userRepository.findOne({
      where: { inviteCode: inviteCode }
    });
    
    if(!user){
      throw new NotFoundException('Invite code not found');
    }

    await this.addScore(user.id, token);

    return true;
  }

  private async addScore(userId: string, token: string) {
   try {
    await firstValueFrom(
        this.grpcScoreService.addScore({
          userId: userId,
          score: 1,
          token: token
        })
      );
    } catch (error) {
      throw new InternalServerErrorException('Failed to add score | auth service', error);
    }
  }
}
