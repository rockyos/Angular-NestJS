import { ConfigService } from './src/config/config.service';
import { ConnectionOptions } from 'typeorm';

const config = new ConfigService();

const ormConfig: ConnectionOptions = {
    type: config.DatabaseType,
    host: config.DatabaseHost,
    port: config.DatabasePort,
    username: config.DatabaseUserName,
    password: config.DatabasePass,
    database: config.DatabaseDbName,
    entities: [__dirname + config.DatabaseEntities],
    migrations: [__dirname + config.DatabaseMigrations],
    synchronize: config.DatabaseSynchronize,
    migrationsRun: config.DatabaseMigrationsRun,
    cli: {
        // Location of migration should be inside src folder
        // to be compiled into dist/ folder.
        migrationsDir: config.DatabaseMigrationsDir,
    },
};

export = ormConfig;