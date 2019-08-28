import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AccountModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      //host: 'localhost',
      // port: 3306,
      //username: 'root',
      // password: 'root',
      database: 'photoApiDB',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
