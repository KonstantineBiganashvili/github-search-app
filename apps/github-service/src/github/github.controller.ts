import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { GithubService } from './github.service';
import { SearchRepositoriesDto } from './dto/search-repositories.dto';

@Controller()
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @MessagePattern({ cmd: 'search-repositories' })
  async searchRepositories(searchDto: SearchRepositoriesDto) {
    return this.githubService.searchRepositories(searchDto);
  }
}
