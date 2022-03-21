import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default class JwtConfig {
  static getConfig(configService: ConfigService): JwtModuleOptions {
    return {
      secret: configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '7d' },
    };
  }
}

export const jwtConfigAsync: any = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<JwtModuleOptions> =>
    JwtConfig.getConfig(configService),
};
