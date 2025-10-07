import { Controller, Get } from '@nestjs/common';
import { GithubServiceService } from './github-service.service';

@Controller()
export class GithubServiceController {
  constructor(private readonly githubServiceService: GithubServiceService) {}

  @Get()
  getHello(): string {
    return this.githubServiceService.getHello();
  }
}
