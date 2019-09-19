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
}
