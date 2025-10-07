import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { RepositoryDto } from './dto/repository.dto';
import { SearchRepositoriesDto } from './dto/search-repositories.dto';

@Injectable()
export class GithubService {
  constructor(
    @Inject('GITHUB_SERVICE') private readonly githubClient: ClientProxy,
  ) {}

  async searchRepositories(
    searchDto: SearchRepositoriesDto,
  ): Promise<RepositoryDto[]> {
    return firstValueFrom(
      this.githubClient.send({ cmd: 'search-repositories' }, searchDto),
    );
  }
}
