import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';
import {
  SearchRepositoriesDto,
  SortOrder,
} from './dto/search-repositories.dto';
import { RepositoryDto } from './dto/repository.dto';
import { GitHubSearchResponse } from './interfaces/github-api.interface';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);
  private readonly githubApiUrl: string;
  private readonly githubToken?: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.githubApiUrl =
      this.configService.get<string>('GITHUB_API_URL') ||
      'https://api.github.com';
    this.githubToken = this.configService.get<string>('GITHUB_API_TOKEN');
  }

  async searchRepositories(
    searchDto: SearchRepositoriesDto,
  ): Promise<RepositoryDto[]> {
    const { query, sort, ignore } = searchDto;

    try {
      const url = `${this.githubApiUrl}/search/repositories`;

      const headers: Record<string, string> = {
        Accept: 'application/vnd.github.v3+json',
      };

      if (this.githubToken) {
        headers['Authorization'] = `token ${this.githubToken}`;
      }

      const response = await firstValueFrom(
        this.httpService.get<GitHubSearchResponse>(url, {
          headers,
          params: {
            q: query,
            per_page: 30,
          },
        }),
      );

      let repositories: RepositoryDto[] = response.data.items.map((item) => ({
        id: item.id,
        name: item.name,
        fullName: item.full_name,
        description: item.description,
        htmlUrl: item.html_url,
        stars: item.stargazers_count,
        language: item.language,
        owner: {
          login: item.owner.login,
          avatarUrl: item.owner.avatar_url,
        },
      }));

      if (ignore) {
        repositories = repositories.filter(
          (repo) => !repo.name.toLowerCase().includes(ignore.toLowerCase()),
        );
        this.logger.log(`Filtered out repositories containing: ${ignore}`);
      }

      if (sort) {
        repositories.sort((a, b) => {
          const comparison = a.name.localeCompare(b.name);
          return sort === SortOrder.ASC ? comparison : -comparison;
        });
        this.logger.log(`Sorted repositories in ${sort} order`);
      }

      this.logger.log(
        `Found ${repositories.length} repositories for query: ${query}`,
      );
      return repositories;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.error(`Error searching GitHub: ${error.message}`);

        const data: unknown = error.response?.data;
        const message =
          data && typeof data === 'object' && 'message' in data
            ? (data as Record<string, unknown>).message
            : undefined;
        throw new BadRequestException(
          typeof message === 'string'
            ? message
            : 'Failed to search GitHub repositories',
        );
      }

      if (error instanceof Error) {
        this.logger.error(`Error searching GitHub: ${error.message}`);
        throw new BadRequestException('Failed to search GitHub repositories');
      }

      this.logger.error('Unknown error occurred while searching GitHub');
      throw new BadRequestException('Failed to search GitHub repositories');
    }
  }
}
