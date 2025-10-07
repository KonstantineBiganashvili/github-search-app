import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';

@Module({
  imports: [LoggerModule, AppConfigModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
