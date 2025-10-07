import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../src/auth/auth.service';
import { AuthController } from '../src/auth/auth.controller';
import { UsersService } from '../src/users/users.service';
import { ConfigModule } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

describe('Auth Service (integration e2e)', () => {
  let app: INestApplication;
  interface LocalMs {
    listen(): Promise<void>;
    close(): Promise<void>;
  }
  let authMs: LocalMs;

  const memory: {
    users: Array<{ id: string; email: string; password: string }>;
  } = {
    users: [],
  };

  const mockUsersService: Partial<UsersService> = {
    create: (email: string, hashedPassword: string) => {
      const user = {
        id: `${memory.users.length + 1}`,
        email,
        password: hashedPassword,
      };
      memory.users.push(user);
      return Promise.resolve({
        id: user.id,
        email: user.email,
      } as unknown as Awaited<ReturnType<UsersService['create']>>);
    },
    findByEmail: (email: string) => {
      const user = memory.users.find((u) => u.email === email) || null;
      return Promise.resolve(
        (user ? { id: user.id, email: user.email } : null) as Awaited<
          ReturnType<UsersService['findByEmail']>
        >,
      );
    },
    findByEmailWithPassword: (email: string) => {
      const user = memory.users.find((u) => u.email === email) || null;
      return Promise.resolve(
        (user
          ? { id: user.id, email: user.email, password: user.password }
          : null) as Awaited<
          ReturnType<UsersService['findByEmailWithPassword']>
        >,
      );
    },
    findById: (id: string) => {
      const user = memory.users.find((u) => u.id === id) || null;
      return Promise.resolve(
        (user ? { id: user.id, email: user.email } : null) as Awaited<
          ReturnType<UsersService['findById']>
        >,
      );
    },
  };

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';
    process.env.JWT_EXPIRATION = process.env.JWT_EXPIRATION || '1h';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION },
        }),
      ],
      controllers: [AuthController],
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    authMs = moduleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 4101 },
    });
    await authMs.listen();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
    await authMs.close();
  });

  it('signup, signin and validate-token', async () => {
    const client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 4101 },
    });

    const signup: { user: { id: string; email: string }; accessToken: string } =
      await firstValueFrom(
        client.send<{
          user: { id: string; email: string };
          accessToken: string;
        }>(
          { cmd: 'signup' },
          { email: 'a@example.com', password: 'Password123!' },
        ),
      );
    expect(signup.user.email).toBe('a@example.com');
    expect(typeof signup.accessToken).toBe('string');

    const signin: { user: { id: string; email: string }; accessToken: string } =
      await firstValueFrom(
        client.send<{
          user: { id: string; email: string };
          accessToken: string;
        }>(
          { cmd: 'signin' },
          { email: 'a@example.com', password: 'Password123!' },
        ),
      );
    expect(signin.user.email).toBe('a@example.com');
    expect(typeof signin.accessToken).toBe('string');

    const validated: { id: string; email: string } = await firstValueFrom(
      client.send<{ id: string; email: string }>(
        { cmd: 'validate-token' },
        { token: signin.accessToken },
      ),
    );
    expect(validated.email).toBe('a@example.com');

    (client as unknown as { close: () => void }).close();
  });
});
