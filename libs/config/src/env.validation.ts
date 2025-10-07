import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum NodeEnvironment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  @IsEnum(NodeEnvironment)
  NODE_ENV!: NodeEnvironment;

  @Type(() => Number)
  @IsNumber()
  API_GATEWAY_PORT!: number;

  @IsString()
  AUTH_SERVICE_HOST!: string;

  @Type(() => Number)
  @IsNumber()
  AUTH_SERVICE_PORT!: number;

  @IsString()
  GITHUB_SERVICE_HOST!: string;

  @Type(() => Number)
  @IsNumber()
  GITHUB_SERVICE_PORT!: number;

  @IsString()
  DATABASE_TYPE!: string;

  @IsString()
  DATABASE_HOST!: string;

  @Type(() => Number)
  @IsNumber()
  DATABASE_PORT!: number;

  @IsString()
  DATABASE_USERNAME!: string;

  @IsString()
  DATABASE_PASSWORD!: string;

  @IsString()
  DATABASE_NAME!: string;

  @Type(() => Boolean)
  @IsBoolean()
  DATABASE_SYNCHRONIZE!: boolean;

  @IsString()
  JWT_SECRET!: string;

  @IsString()
  JWT_EXPIRATION!: string;

  @IsString()
  GITHUB_API_URL!: string;

  @IsOptional()
  @IsString()
  GITHUB_API_TOKEN?: string;
}
