import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
