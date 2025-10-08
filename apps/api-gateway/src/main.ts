import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from './api-gateway.module';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { RpcToHttpExceptionFilter } from './common/filters/rpc-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RepositoryDto } from './github/dto/repository.dto';
import { SearchRepositoriesDto } from './github/dto/search-repositories.dto';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new RpcToHttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const config = new DocumentBuilder()
    .setTitle('GitHub Search App')
    .setDescription('GitHub Search App API')
    .setVersion('1.0')
    .addTag('auth', 'Authentication endpoints')
    .addTag('github', 'GitHub repository search endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    extraModels: [RepositoryDto, SearchRepositoriesDto],
  });
  SwaggerModule.setup('api/swagger', app, document);

  const configService = app.get(ConfigService);
  const port = configService.get<number>('API_GATEWAY_PORT') ?? 3000;

  await app.listen(port);

  console.log(`API Gateway is running on http://localhost:${port}`);
}

bootstrap();
