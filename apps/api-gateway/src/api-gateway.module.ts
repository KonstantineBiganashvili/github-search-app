import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';
import { AuthModule } from './auth/auth.module';
import { GithubModule } from './github/github.module';

@Module({
  imports: [LoggerModule, AppConfigModule, AuthModule, GithubModule],
  controllers: [],
  providers: [],
})
export class ApiGatewayModule {}
