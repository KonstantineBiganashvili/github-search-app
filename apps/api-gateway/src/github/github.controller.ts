import { Controller, Get, Query, UseGuards, ValidationPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { GithubService } from './github.service';
import {
  SearchRepositoriesDto,
  SortOrder,
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
  @ApiOperation({
    summary: 'Search GitHub repositories',
    description:
      'Search for repositories on GitHub with optional sorting and filtering',
  })
  @ApiQuery({
    name: 'query',
    required: true,
    description: 'Search query string',
    example: 'nestjs',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: SortOrder,
    description: 'Sort order by repository name',
    example: SortOrder.ASC,
  })
  @ApiQuery({
    name: 'ignore',
    required: false,
    description: 'Ignore repositories whose name includes this string',
    example: 'demo',
  })
  @ApiResponse({
    status: 200,
    description: 'List of repositories',
    type: [RepositoryDto],
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid query parameters',
  })
  async searchRepositories(
    @Query(ValidationPipe) searchDto: SearchRepositoriesDto,
  ): Promise<RepositoryDto[]> {
    return this.githubService.searchRepositories(searchDto);
  }
}
