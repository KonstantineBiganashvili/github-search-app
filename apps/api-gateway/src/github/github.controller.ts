import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GithubService } from './github.service';
import {
  SearchRepositoriesDto,

} from './dto/search-repositories.dto';
import { RepositoryDto } from './dto/repository.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('github')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard) 
@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('search')
  async searchRepositories(
    @Query(ValidationPipe) searchDto: SearchRepositoriesDto,
  ): Promise<RepositoryDto[]> {
    return this.githubService.searchRepositories(searchDto);
  }
}
