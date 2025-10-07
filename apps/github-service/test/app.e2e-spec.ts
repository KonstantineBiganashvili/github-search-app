import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { GithubServiceModule } from './../src/github-service.module';
import { GithubService } from './../src/github/github.service';
import { HttpService } from '@nestjs/axios';
import { of, throwError } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';

describe('GitHub Service (e2e)', () => {
  let app: INestApplication;

  afterEach(async () => {
    if (app) await app.close();
  });

  it('returns mapped repositories from GitHub API', async () => {
    const mockResponse: AxiosResponse = {
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
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as AxiosResponse['config'],
    } as AxiosResponse;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GithubServiceModule],
    })
      .overrideProvider(HttpService)
      .useValue({ get: jest.fn(() => of(mockResponse)) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const svc = app.get<GithubService>(GithubService);
    const result = await svc.searchRepositories({
      query: 'nestjs',
    } as unknown as Parameters<GithubService['searchRepositories']>[0]);
    expect(result).toHaveLength(2);
    expect(result[0].name).toBe('repo-a');
  });

  it('throws BadRequestException on API error', async () => {
    const axiosError = {
      isAxiosError: true,
      message: 'API Error',
      response: { data: { message: 'Rate limit exceeded' } },
    } as AxiosError;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [GithubServiceModule],
    })
      .overrideProvider(HttpService)
      .useValue({ get: jest.fn(() => throwError(() => axiosError)) })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const svc = app.get<GithubService>(GithubService);
    await expect(
      svc.searchRepositories({ query: 'nestjs' } as unknown as Parameters<
        GithubService['searchRepositories']
      >[0]),
    ).rejects.toThrow('Failed to search GitHub repositories');
  });
});
