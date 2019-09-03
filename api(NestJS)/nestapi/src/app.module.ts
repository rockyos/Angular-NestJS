import { Module } from '@nestjs/common';
import { AccountModule } from './Modules/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoModule } from './Modules/photo.module';

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
        migrations:[__dirname + '/../migrations/*{.ts,.js}'],
        migrationsTableName: 'migrations_typeorm',
        migrationsRun: true,
        synchronize: true,
      }
    ),
    PhotoModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
