import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { GrpcAuthService } from '@app/common';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private readonly grpcAuthService: GrpcAuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const userId = request.params.id;

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