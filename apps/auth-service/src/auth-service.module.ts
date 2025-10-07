import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthServiceService } from './auth-service.service';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [LoggerModule, AppConfigModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [AuthServiceController],
  providers: [AuthServiceService],
})
export class AuthServiceModule {}
