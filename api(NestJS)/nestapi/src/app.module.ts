import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './modules/photo.module';
import { ConfigModule } from './config/config.module';
import { ScheduleModule } from 'nest-schedule';
import { LoggerModule } from './modules/logger.module';

@Module({
  imports: [AccountModule,
    TypeOrmModule.forRoot(),
    ScheduleModule.register(),
    PhotoModule,
    ConfigModule,
    LoggerModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
