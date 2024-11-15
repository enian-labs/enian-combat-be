import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  constructor() {
    dotenv.config({
      path: `.env`,
    });

    for (const envName of Object.keys(process.env)) {
      const envValue = process.env[envName];
      if (envValue) {
        process.env[envName] = envValue.replace(/\\n/g, '\n');
      }
    }
  }

  public get(key: string): string {
    const value = process.env[key];
    if (value === undefined) {
      throw new Error(`Environment variable ${key} is not set`);
    }
    return value;
  }

  public getNumber(key: string): number {
    return Number(this.get(key));
  }

  getBoolean(key: string): boolean {
    const value = this.get(key);
    return value === 'true';
  }

  get app() {
    return {
      host: this.get('HOST') || 'localhost',
      port: this.get('PORT') || 4000,
      url: this.get('APP_URL') || '',
    };
  }

  get telegram() {
    return {
      botToken: this.get('TELEGRAM_BOT_TOKEN') || '',
    };
  }
}
