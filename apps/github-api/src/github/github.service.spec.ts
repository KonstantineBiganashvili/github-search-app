import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosError } from 'axios';
import { GithubService } from './github.service';
import { SortOrder } from './dto/search-repositories.dto';

describe('GithubService', () => {
  let service: GithubService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        GITHUB_API_URL: 'https://api.github.com',
        GITHUB_API_TOKEN: '',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GithubService,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<GithubService>(GithubService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchRepositories', () => {
    const mockGithubResponse = {
      data: {
        items: [
          {
            id: 1,
            name: 'repo-a',
            full_name: 'user/repo-a',
            description: 'Description A',
            html_url: 'https://github.com/user/repo-a',
            stargazers_count: 100,
            language: 'TypeScript',
            owner: {
              login: 'user',
              avatar_url: 'https://avatar.url',
            },
          },
          {
            id: 2,
            name: 'repo-b',
            full_name: 'user/repo-b',
            description: 'Description B',
            html_url: 'https://github.com/user/repo-b',
            stargazers_count: 200,
            language: 'JavaScript',
            owner: {
              login: 'user',
              avatar_url: 'https://avatar.url',
            },
          },
        ],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as AxiosResponse['config'],
    } as AxiosResponse;

    it('should search repositories successfully', async () => {
      mockHttpService.get.mockReturnValue(of(mockGithubResponse));

      const result = await service.searchRepositories({ query: 'nestjs' });

      expect(mockHttpService.get).toHaveBeenCalled();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('repo-a');
      expect(result[1].name).toBe('repo-b');
    });

    it('should sort repositories in ascending order', async () => {
      mockHttpService.get.mockReturnValue(of(mockGithubResponse));

      const result = await service.searchRepositories({
        query: 'nestjs',
        sort: SortOrder.ASC,
      });

      expect(result[0].name).toBe('repo-a');
      expect(result[1].name).toBe('repo-b');
    });

    it('should sort repositories in descending order', async () => {
      mockHttpService.get.mockReturnValue(of(mockGithubResponse));

      const result = await service.searchRepositories({
        query: 'nestjs',
        sort: SortOrder.DESC,
      });

      expect(result[0].name).toBe('repo-b');
      expect(result[1].name).toBe('repo-a');
    });

    it('should filter repositories by ignore parameter', async () => {
      mockHttpService.get.mockReturnValue(of(mockGithubResponse));

      const result = await service.searchRepositories({
        query: 'nestjs',
        ignore: 'repo-a',
      });

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('repo-b');
    });

    it('should throw BadRequestException on API error', async () => {
      const axiosError = {
        isAxiosError: true,
        message: 'API Error',
        response: {
          data: { message: 'Rate limit exceeded' },
        },
      } as AxiosError;

      mockHttpService.get.mockReturnValue(throwError(() => axiosError));

      await expect(
        service.searchRepositories({ query: 'nestjs' }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
