import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export class SearchRepositoriesDto {
  @ApiProperty({
    example: 'nestjs',
    description: 'Search query for GitHub repositories',
  })
  @IsString()
  @IsNotEmpty()
  query: string;

  @ApiPropertyOptional({
    enum: SortOrder,
    example: SortOrder.ASC,
    description: 'Sort repositories by name in ascending or descending order',
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiPropertyOptional({
    example: 'demo',
    description: 'Ignore repositories whose name contains this string',
  })
  @IsOptional()
  @IsString()
  ignore?: string;
}
