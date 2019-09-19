import { ConfigService } from './src/config/config.service';
import { ConnectionOptions } from 'typeorm';

const config = new ConfigService();

const ormConfig: ConnectionOptions = {
    type: config.DatabaseType,
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'superuser',
    database: 'postgres',
    entities: [__dirname + '/models/entity/*.entity{.ts,.js}'],
    synchronize: true,
    migrationsRun: true,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    cli: {
        // Location of migration should be inside src folder
        // to be compiled into dist/ folder.
        migrationsDir: 'src/Migrations',
    },
};

export = ormConfig;
