import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { RabbitMQService } from '../services';

@Catch()
export class ErrorLoggerFilter implements ExceptionFilter {
  constructor(private readonly rabbitMQService: RabbitMQService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    if (status >= 500 && status < 600) {
      const errorLog = {
        timestamp: new Date().toISOString(),
        statusCode: status,
        message: exception.message,
        path: request.url,
        method: request.method,
        body: request.body,
      };
    
      this.rabbitMQService.publishErrorLog(JSON.stringify(errorLog));

      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: exception.message || 'Internal server error',
      });
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message ?? 'Internal server error',
    });
  }
}