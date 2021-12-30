import { ConfigModule, ConfigService } from '@nestjs/config';

export interface IRedisConfig {
  host: string;
  port: number;
}

export default class RedisConfig {
  static getConfig(configService: ConfigService): IRedisConfig {
    return {
      host: configService.get<string>('REDIS_HOST'),
      port: parseInt(configService.get<string>('REDIS_PORT')),
    };
  }
}

export const redisConfigAsync: any = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<IRedisConfig> =>
    RedisConfig.getConfig(configService),
};
