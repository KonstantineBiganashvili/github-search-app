import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

import { firstValueFrom } from 'rxjs';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authClient: ClientProxy,
  ) {}

  async signup(signupDto: SignUpDto): Promise<AuthResponseDto> {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'signup' }, signupDto),
      );
    } catch (err: unknown) {
      const { status, message } =
        typeof err === 'object' && err !== null
          ? (err as { status?: number; message?: string })
          : {};
      throw new HttpException(
        message || 'Internal server error',
        typeof status === 'number' ? status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signin(signinDto: SignInDto): Promise<AuthResponseDto> {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'signin' }, signinDto),
      );
    } catch (err: unknown) {
      const { status, message } =
        typeof err === 'object' && err !== null
          ? (err as { status?: number; message?: string })
          : {};
      throw new HttpException(
        message || 'Internal server error',
        typeof status === 'number' ? status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async validateToken(token: string): Promise<{ id: string; email: string }> {
    try {
      return await firstValueFrom(
        this.authClient.send({ cmd: 'validate-token' }, { token }),
      );
    } catch (err: unknown) {
      const { status, message } =
        typeof err === 'object' && err !== null
          ? (err as { status?: number; message?: string })
          : {};
      throw new HttpException(
        message || 'Internal server error',
        typeof status === 'number' ? status : HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
