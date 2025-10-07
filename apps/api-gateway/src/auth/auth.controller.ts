import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body(ValidationPipe) signupDto: SignUpDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  async signin(@Body(ValidationPipe) signinDto: SignInDto) {
    return this.authService.signin(signinDto);
  }
}
