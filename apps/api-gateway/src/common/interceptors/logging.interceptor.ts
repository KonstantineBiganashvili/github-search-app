import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Request, Response } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger(LoggingInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();
    const method = request.method;
    const url = request.url;
    const body = request.body as unknown;
    const headers = request.headers;
    const userAgent = (headers['user-agent'] as string) || '';
    const startTime = Date.now();

    this.logger.log(
      `Incoming Request: ${method} ${url} - User-Agent: ${userAgent}`,
    );

    if (
      body &&
      typeof body === 'object' &&
      Object.keys(body as Record<string, unknown>).length > 0
    ) {
      this.logger.debug(`Request Body: ${JSON.stringify(body, null, 2)}`);
    }

    return next.handle().pipe(
      tap({
        next: (responseBody) => {
          const duration = Date.now() - startTime;
          const statusCode = response.statusCode;

          this.logger.log(
            `Outgoing Response: ${method} ${url} - ${statusCode} - ${duration}ms`,
          );

          if (responseBody && typeof responseBody === 'object') {
            this.logger.debug(
              `Response Body: ${JSON.stringify(responseBody, null, 2)}`,
            );
          }
        },
        error: (error: unknown) => {
          const duration = Date.now() - startTime;
          const statusCode = (error as { status?: number })?.status || 500;
          const message =
            (error as { message?: string })?.message || 'Unknown error';

          this.logger.error(
            `Request Error: ${method} ${url} - ${statusCode} - ${duration}ms - ${message}`,
          );
        },
      }),
    );
  }
}
