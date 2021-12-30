import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as morgan from 'morgan';
import { VersioningType } from '@nestjs/common';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // or "app.enableVersioning()"
  // app.enableVersioning({
  //   type: VersioningType.URI,
  // });
  // app.enableVersioning({
  //   type: VersioningType.HEADER,
  //   header: 'Custom-Header',
  // });
  // app.enableVersioning({
  //   type: VersioningType.MEDIA_TYPE,
  //   key: 'v=',
  // });
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(morgan('tiny', { stream: logStream }));
  await app.listen(4000);
}
bootstrap();
