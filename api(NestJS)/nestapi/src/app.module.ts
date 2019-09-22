import { Module } from '@nestjs/common';
import { AccountModule } from './modules/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './modules/photo.module';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [AccountModule,
    TypeOrmModule.forRoot(),
    PhotoModule,
    ConfigModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
