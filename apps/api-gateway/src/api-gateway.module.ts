import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [LoggerModule, AppConfigModule],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
