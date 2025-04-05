import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { TOKEN_VALIDATION_PACKAGE_NAME, TokenValidationServiceClient, UserRoles, TOKEN_VALIDATION_SERVICE_NAME } from '@app/common';
import { GrpcAuthService } from '@app/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private readonly grpcAuthService: GrpcAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const userId = request.params.user_id;

    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const response = await firstValueFrom(
        this.grpcAuthService.validateToken({ token })
      );
 
      if (response.userId !== userId) {
        throw new ForbiddenException();
      }

      return true;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromHeader(request: any): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
} 