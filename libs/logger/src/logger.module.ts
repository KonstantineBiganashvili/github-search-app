import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { createWinstonConfig } from './logger.config';

@Module({
  imports: [WinstonModule.forRoot(createWinstonConfig())],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
