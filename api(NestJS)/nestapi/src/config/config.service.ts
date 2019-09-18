import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {
  private readonly envConfig: { [key: string]: any };

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath))
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
}