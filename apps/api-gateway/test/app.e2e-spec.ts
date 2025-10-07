import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ApiGatewayModule } from './../src/api-gateway.module';
import { GithubServiceModule } from '../../github-app/src/github-app.module';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of } from 'rxjs';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';

describe('API Gateway (integration e2e)', () => {
  let app: INestApplication;
  interface LocalMs {
    listen(): Promise<void>;
    close(): Promise<void>;
  }
  let githubMs: LocalMs;

  beforeAll(async () => {
    process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

    const githubModuleFixture: TestingModule = await Test.createTestingModule({
      imports: [GithubServiceModule],
    })
      .overrideProvider(HttpService)
      .useValue({
        get: jest.fn().mockReturnValue(
          of({
            data: {
              items: [
                {
                  id: 1,
                  name: 'repo-a',
                  full_name: 'u/a',
                  description: '',
                  html_url: '',
                  stargazers_count: 1,
                  language: 'ts',
                  owner: { login: 'u', avatar_url: '' },
                },
                {
                  id: 2,
                  name: 'repo-b',
                  full_name: 'u/b',
                  description: '',
                  html_url: '',
                  stargazers_count: 2,
                  language: 'js',
                  owner: { login: 'u', avatar_url: '' },
                },
              ],
            },
          } as AxiosResponse),
        ),
      })
      .compile();

    githubMs = githubModuleFixture.createNestMicroservice({
      transport: Transport.TCP,
      options: { host: '127.0.0.1', port: 4002 },
    });
    await githubMs.listen();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiGatewayModule],
    })
      .overrideProvider('GITHUB_SERVICE')
      .useValue(
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: { host: '127.0.0.1', port: 4002 },
        }),
      )
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    const client: { close?: () => Promise<void> | void } = app.get(
      'GITHUB_SERVICE',
      { strict: false },
    );
    if (client && typeof client.close === 'function') {
      await client.close();
    }
    await app.close();
    await githubMs.close();
  });

  it('/github/search (GET) returns repositories through microservice', async () => {
    const server: import('http').Server =
      app.getHttpServer() as unknown as import('http').Server;
    const token = new JwtService({
      secret: process.env.JWT_SECRET as string,
    }).sign({ sub: 'u1', email: 'user@example.com' });
    const res = await request(server)
      .get('/github/search')
      .set('Authorization', `Bearer ${token}`)
      .query({ query: 'nestjs' })
      .expect(200);

    expect(Array.isArray(res.body)).toBe(true);
    const body = res.body as Array<{ name: string }>;
    expect(body).toHaveLength(2);
    expect(body[0].name).toBe('repo-a');
  });
});
