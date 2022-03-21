import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchController } from './search.controller';

@Module({
  imports: [
    ConfigModule,
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        node: configService.get('ELASTICSEARCH_NODE'),
        auth: {
          username: configService.get('ELASTICSEARCH_USERNAME'),
          password: '123abc',
        },
        // headers: {
        //   Accept: 'application/json',
        //   'Content-Type': 'application/json',
        // },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [ElasticsearchModule],
  controllers: [SearchController],
})
export class SearchModule {}
