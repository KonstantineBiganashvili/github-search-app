import { Module } from '@nestjs/common';
import { LoggerModule } from '@app/logger';
import { AppConfigModule } from '@app/config';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [LoggerModule, AppConfigModule, DatabaseModule, UsersModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AuthServiceModule {}
