import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import type { Response } from 'express';

interface RpcErrorPayload {
  status?: number;
  message?: string;
}

function isRpcErrorPayload(value: unknown): value is RpcErrorPayload {
  if (typeof value !== 'object' || value === null) return false;
  const maybe = value as Record<string, unknown>;
  return 'status' in maybe || 'message' in maybe;
}

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const error: unknown = exception.getError();
    const payload: RpcErrorPayload = isRpcErrorPayload(error) ? error : {};

    const status =
      typeof payload.status === 'number'
        ? payload.status
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      typeof payload.message === 'string' && payload.message.length > 0
        ? payload.message
        : 'Internal server error';

    return response.status(status).json({ statusCode: status, message });
  }
}
