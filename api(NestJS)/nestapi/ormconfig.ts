export = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'superuser',
    database: 'postgres',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + 'src/migration/*{.ts,.js}'],

    // cli: {
    //     entitiesDir: 'src/models/entity',
    //     migrationsDir: 'src/migrations',
    // },
    migrationsTableName: 'migrations_typeorm',
    migrationsRun: true,
    synchronize: true,
};