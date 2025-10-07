import { Test, TestingModule } from '@nestjs/testing';
import { GithubServiceController } from './github-service.controller';
import { GithubServiceService } from './github-service.service';

describe('GithubServiceController', () => {
  let githubServiceController: GithubServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GithubServiceController],
      providers: [GithubServiceService],
    }).compile();

    githubServiceController = app.get<GithubServiceController>(GithubServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(githubServiceController.getHello()).toBe('Hello World!');
    });
  });
});
