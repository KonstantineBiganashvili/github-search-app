import { NestFactory } from '@nestjs/core';
import { GithubServiceModule } from './github-app.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    GithubServiceModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.GITHUB_SERVICE_HOST || '0.0.0.0',
        port: parseInt(process.env.GITHUB_SERVICE_PORT || '3002', 10),
      },
    },
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen();

  console.log(
    `Github Service is listening on ${process.env.GITHUB_SERVICE_HOST || '0.0.0.0'}:${process.env.GITHUB_SERVICE_PORT || '3002'}`,
  );
}

bootstrap();
