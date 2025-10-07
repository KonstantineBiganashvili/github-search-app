import { Module } from '@nestjs/common';
import { GithubServiceController } from './github-service.controller';
import { GithubServiceService } from './github-service.service';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';
import { GithubModule } from './github/github.module';

@Module({
  imports: [LoggerModule, AppConfigModule, GithubModule],
  controllers: [GithubServiceController],
  providers: [GithubServiceService],
})
export class GithubServiceModule {}
