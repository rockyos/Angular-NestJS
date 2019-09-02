import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AccountModule } from './account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [AccountModule,
    TypeOrmModule.forRoot(
      {
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'superuser',
        database: 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations:['migration/*.ts'],
        synchronize: true,
      }
    )],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
