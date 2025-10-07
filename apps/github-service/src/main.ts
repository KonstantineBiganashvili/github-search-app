import { NestFactory } from '@nestjs/core';
import { GithubServiceModule } from './github-service.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(GithubServiceModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  const configService = app.get(ConfigService);
  const port = configService.get<number>('GITHUB_SERVICE_PORT') ?? 3000;
  await app.listen(port);
}
bootstrap();
