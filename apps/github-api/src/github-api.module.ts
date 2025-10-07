import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';
import { GithubModule } from './github/github.module';

@Module({
  imports: [LoggerModule, AppConfigModule, GithubModule],
  controllers: [],
  providers: [],
})
export class GithubApiModule {}
