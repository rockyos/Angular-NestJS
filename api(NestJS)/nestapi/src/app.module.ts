import { Module } from '@nestjs/common';
import { AccountModule } from './Modules/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './Modules/photo.module';

@Module({
  imports: [AccountModule,
    TypeOrmModule.forRoot(),
    PhotoModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
