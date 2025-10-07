import { Inject, Injectable } from '@nestjs/common';
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
    return firstValueFrom(this.authClient.send({ cmd: 'signup' }, signupDto));
  }

  async signin(signinDto: SignInDto): Promise<AuthResponseDto> {
    return firstValueFrom(this.authClient.send({ cmd: 'signin' }, signinDto));
  }

  async validateToken(token: string): Promise<{ id: string; email: string }> {
    return firstValueFrom(
      this.authClient.send({ cmd: 'validate-token' }, { token }),
    );
  }
}
