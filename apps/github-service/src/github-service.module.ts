import { Module } from '@nestjs/common';
import { GithubServiceController } from './github-service.controller';
import { GithubServiceService } from './github-service.service';
import { LoggerModule } from '@app/logger';

@Module({
  imports: [LoggerModule],
  controllers: [GithubServiceController],
  providers: [GithubServiceService],
})
export class GithubServiceModule {}
