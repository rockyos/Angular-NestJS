import { Module } from '@nestjs/common';
import { AccountModule } from './Modules1/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './Modules1/photo.module';
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
