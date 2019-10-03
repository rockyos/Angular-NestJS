import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: any };

  constructor() {
    let filePath = `development.env`;
    if (process.env.NODE_ENV) {
      filePath = `${process.env.NODE_ENV}.env`;
    }
    try {
      fs.statSync(filePath);
    } catch {
      filePath = `development.env`;
    }
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));

  }

  getString(key: string): string {
    return this.envConfig[key];
  }

  getNumber(key: string): number {
    return this.envConfig[key];
  }

  getBool(key: string): boolean {
    return this.envConfig[key];
  }

  get DatabaseType(): any {
    return this.envConfig.DB_TYPE;
  }

  get DatabaseHost(): any {
    return this.envConfig.DB_HOST;
  }

  get  DatabasePort(): number {
    return this.envConfig.DB_PORT;
  }

  get  DatabaseUserName(): string {
    return this.envConfig.DB_USERNAME;
  }

  get  DatabasePass(): string {
    return this.envConfig.DB_PASSWORD;
  }

  get  DatabaseDbName(): string {
    return this.envConfig.DB_DATABASE;
  }

  get  DatabaseEntities(): string {
    return this.envConfig.DB_ENTITIES;
  }

  get  DatabaseMigrations(): string {
    return this.envConfig.DB_MIGRATION;
  }

  get  DatabaseMigrationsTable(): string {
    return this.envConfig.DB_MIGRAT_TABLE;
  }

  get  DatabaseMigrationsRun(): boolean {
    return this.envConfig.DB_MIGRAT_RUN;
  }

  get  DatabaseSynchronize(): boolean {
    return this.envConfig.DB_SYNCHRONIZE;
  }

  get  DatabaseMigrationsDir(): string {
    return this.envConfig.DB_MIGRATIONDIR;
  }

  get  HostUrl(): string {
    return this.envConfig.HOST_URL;
  }

  get  HostPort(): number {
    return this.envConfig.HOST_PORT;
  }

  get  MailHost(): string {
    return this.envConfig.MAIL_HOST;
  }

  get  MailPort(): number {
    return this.envConfig.MAIL_PORT;
  }

  get  MailSecure(): boolean {
    return this.envConfig.MAIL_SECURE;
  }

  get  MailUser(): string {
    return this.envConfig.MAIL_USER;
  }

  get  MailPass(): string {
    return this.envConfig.MAIL_PASSWORD;
  }

  get  MailLinkValid(): number {
    return this.envConfig.LINK_VALID_IN_HOURS;
  }

  get  SessionKey(): string {
    return this.envConfig.SESSION_KEY;
  }

  get SessionSecret(): string{
    return this.envConfig.SESSION_SECRET;
  }

  get SessionReSave(): boolean{
    return this.envConfig.SESSION_RESAVE;
  }

  get SessionSaveUnitialized(): boolean{
    return this.envConfig.SESSION_SAVEUNITILIZED;
  }
  
  get  JwtSecretKey(): string {
    return this.envConfig.JWT_SECRET_KEY;
  }

  get  JwtInspires(): string {
    return this.envConfig.JWT_EXPIRES;
  }

  get  TaskInterval(): number {
    return this.envConfig.TASK_INTERVAL_IN_MINUTES;
  }
  
}
