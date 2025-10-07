import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { SignInDto } from './dto/sign-in.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern({ cmd: 'signup' })
  async signup(signupDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signup(signupDto);
  }

  @MessagePattern({ cmd: 'signin' })
  async signin(signinDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signin(signinDto);
  }

  @MessagePattern({ cmd: 'validate-token' })
  async validateToken(data: {
    token: string;
  }): Promise<{ id: string; email: string }> {
    return this.authService.validateToken(data.token);
  }
}
