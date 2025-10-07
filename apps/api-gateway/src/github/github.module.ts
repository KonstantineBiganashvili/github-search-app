import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';

@Module({
  imports: [
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
  ],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
