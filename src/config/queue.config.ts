import { ConfigModule, ConfigService } from '@nestjs/config';
import RedisConfig from './redis.config';
import { QueueOptions } from 'bull';

export default class QueueConfig {
  static getConfig(configService: ConfigService): QueueOptions {
    return {
      redis: RedisConfig.getConfig(configService),
    };
  }
}

export const queueConfigAsync: any = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<QueueOptions> =>
    QueueConfig.getConfig(configService),
};
