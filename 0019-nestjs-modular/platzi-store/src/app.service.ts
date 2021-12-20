import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from './config';

@Injectable()
export class AppService {
  constructor(
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
  ) {}

  getHello(): string {
    const apiKey = this.configService.apiKey;
    const databaseName = this.configService.database.name;
    const databasePort = this.configService.database.port;
    return `Hello World ${apiKey} ${databaseName} ${databasePort}`;
  }
}
