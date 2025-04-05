import { Inject, Injectable } from '@nestjs/common';
import { TOKEN_VALIDATION_SERVICE_NAME, TokenValidationServiceClient, TokenValidationRequest, TokenValidationResponse } from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class GrpcAuthService implements TokenValidationServiceClient {
    private authService: TokenValidationServiceClient;


    constructor(
        @Inject(TOKEN_VALIDATION_SERVICE_NAME)
        private readonly client: ClientGrpc,
      ) {
        this.authService = this.client.getService<TokenValidationServiceClient>(TOKEN_VALIDATION_SERVICE_NAME);
      }

      validateToken(request: TokenValidationRequest): Observable<TokenValidationResponse> {
        return this.authService.validateToken(request);
      }
} 