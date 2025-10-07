import { Module } from '@nestjs/common';
import { GithubServiceController } from './github-service.controller';
import { GithubServiceService } from './github-service.service';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [LoggerModule, AppConfigModule],
  controllers: [GithubServiceController],
  providers: [GithubServiceService],
})
export class GithubServiceModule {}
