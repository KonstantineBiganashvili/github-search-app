import { ApiProperty } from '@nestjs/swagger';

class OwnerDto {
  @ApiProperty({
    example: 'nestjs',
    description: 'Repository owner username',
  })
  login: string;

  @ApiProperty({
    example: 'https://avatars.githubusercontent.com/u/28507035?v=4',
    description: 'Owner avatar URL',
  })
  avatarUrl: string;
}

export class RepositoryDto {
  @ApiProperty({
    example: 12345678,
    description: 'Repository unique identifier',
  })
  id: number;

  @ApiProperty({
    example: 'nest',
    description: 'Repository name',
  })
  name: string;

  @ApiProperty({
    example: 'nestjs/nest',
    description: 'Full repository name (owner/repo)',
  })
  fullName: string;

  @ApiProperty({
    example:
      'A progressive Node.js framework for building efficient and scalable server-side applications.',
    description: 'Repository description',
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    example: 'https://github.com/nestjs/nest',
    description: 'Repository URL on GitHub',
  })
  htmlUrl: string;

  @ApiProperty({
    example: 65000,
    description: 'Number of stars',
  })
  stars: number;

  @ApiProperty({
    example: 'TypeScript',
    description: 'Primary programming language',
    nullable: true,
  })
  language: string | null;

  @ApiProperty({
    type: OwnerDto,
    description: 'Repository owner information',
  })
  owner: OwnerDto;
}
