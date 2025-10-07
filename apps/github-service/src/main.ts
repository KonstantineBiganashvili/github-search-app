import { NestFactory } from '@nestjs/core';
import { GithubServiceModule } from './github-service.module';

async function bootstrap() {
  const app = await NestFactory.create(GithubServiceModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
