import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RpcException } from '@nestjs/microservices';

import { AuthResponseDto } from './dto/auth-response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password } = signupDto;

    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new RpcException({
        status: 409,
        message: 'User with this email already exists',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.usersService.create(email, hashedPassword);

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
    };
  }

  async signin(signinDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signinDto;

    const user = await this.usersService.findByEmailWithPassword(email);
    if (!user) {
      throw new RpcException({ status: 401, message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new RpcException({ status: 401, message: 'Invalid credentials' });
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      email: user.email,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
      },
      accessToken,
    };
  }

  async validateToken(token: string): Promise<{ id: string; email: string }> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        token,
      );

      const user = await this.usersService.findById(payload.sub);
      if (!user) {
        throw new RpcException({ status: 404, message: 'User not found' });
      }

      return {
        id: user.id,
        email: user.email,
      };
    } catch {
      throw new RpcException({ status: 401, message: 'Invalid token' });
    }
  }
}
