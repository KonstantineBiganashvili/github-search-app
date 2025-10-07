import { Module } from '@nestjs/common';
import { GithubServiceController } from './github-service.controller';
import { GithubServiceService } from './github-service.service';

@Module({
  imports: [],
  controllers: [GithubServiceController],
  providers: [GithubServiceService],
})
export class GithubServiceModule {}
