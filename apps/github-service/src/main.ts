import { NestFactory } from '@nestjs/core';
import { GithubServiceModule } from './github-service.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(GithubServiceModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
