import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module'
import { LoggerService } from "nest-logger";
import { ConfigService } from '../config/config.service'

@Module({
    imports: [ConfigModule],
    providers: [
      {
        provide: LoggerService,
        useFactory: (config: ConfigService) => {
          // logLevel: debug, info, warn or error
          // serviceName: daily rotate files will have this name
          // logAppenders: console or rotate or both in array
          // logFilePath: where daily rotate files are saved
          // timeFormat?: winston's time format syntax. Defaults to "YYYY-MM-DD HH:mm:ss".
          // fileDatePattern?: appended to daily rotate filename. Defaults to "YYYY-MM-DD".
          // maxFiles?: how long rotate files are stored. Defaults to "10d" which means 10 days.
          // zippedArchive?: whether to zip old log file. Defaults to false.
          return new LoggerService(config.logLevel, config.serviceName, config.logAppenders, config.logFilePath);
        },
        inject: [ConfigService],
      },
    ],
    exports: [LoggerService],
  
})
export class LoggerModule {}
