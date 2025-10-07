import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    AppConfigModule,
    ClientsModule.registerAsync([
      {
        name: 'GITHUB_SERVICE',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('GITHUB_SERVICE_HOST'),
            port: configService.get<number>('GITHUB_SERVICE_PORT'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
    AuthModule,
  ],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
