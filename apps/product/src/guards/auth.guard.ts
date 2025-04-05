import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, firstValueFrom } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { TOKEN_VALIDATION_PACKAGE_NAME, TokenValidationServiceClient, UserRoles, TOKEN_VALIDATION_SERVICE_NAME } from '@app/common';
import { GrpcAuthService } from '@app/common';

@Injectable()
export class AuthGuard implements CanActivate {
    // private tokenValidationService: TokenValidationServiceClient;

  constructor(
    private reflector: Reflector,
    private readonly grpcAuthService: GrpcAuthService,
    // @Inject(TOKEN_VALIDATION_PACKAGE_NAME) private client: ClientGrpc,
  ) {}

  onModuleInit() {
    // this.tokenValidationService = this.client.getService(TOKEN_VALIDATION_SERVICE_NAME);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRole = this.reflector.getAllAndOverride<UserRoles>('role', [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const response = await firstValueFrom(
        this.grpcAuthService.validateToken({ token })
      );

      request['user'] = response;
      if (!requiredRole) {
        return true;
      }

      if (!response.isValid) {
        throw new UnauthorizedException();
      }

      if (response.role !== requiredRole.toString()) {
        throw new ForbiddenException(
          `This action requires ${requiredRole} role`
        );
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