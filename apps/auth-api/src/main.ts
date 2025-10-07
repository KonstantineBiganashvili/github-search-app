import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AuthApiModule } from './auth-api.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AuthApiModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
        port: parseInt(process.env.AUTH_SERVICE_PORT || '3001', 10),
      },
    },
  );

  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  await app.listen();

  console.log(
    `Auth Service is listening on ${process.env.AUTH_SERVICE_HOST || '0.0.0.0'}:${process.env.AUTH_SERVICE_PORT || '3001'}`,
  );
}

bootstrap();
