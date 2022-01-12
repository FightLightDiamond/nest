import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as morgan from 'morgan';
import { VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { WinstonModule } from 'nest-winston';
import winston from 'winston';

const logStream = fs.createWriteStream('api.log', {
  flags: 'a',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    // logger:
    //   process.env.NODE_ENV === 'production'
    //     ? WinstonModule.createLogger({
    //         level: 'info',
    //         format: winston?.format?.json(),
    //         transports: [
    //           new winston.transports.File({
    //             filename: 'logs/error.log',
    //             level: 'error',
    //           }),
    //           new winston.transports.File({
    //             filename: 'logs/query.log',
    //             level: 'query',
    //           }),
    //           new winston.transports.File({
    //             filename: 'logs/info.log',
    //             level: 'info',
    //           }),
    //           new winston.transports.Console({
    //             format: winston.format.combine(
    //               winston.format.colorize(),
    //               winston.format.json(),
    //             ),
    //           }),
    //         ],
    //       })
    //     : undefined,
  });
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

  // const app1 = await NestFactory.createMicroservice(AppModule, {
  //   port: 4000,
  //   transport: Transport.RMQ,
  //   options: {
  //     // urls: ['amqp://localhost:5672'],
  //     urls: [
  //       'amqps://lkgvypfe:FQyQTYsqweJ1xZTALzRW9eDfFjl7lqQX@mustang.rmq.cloudamqp.com/lkgvypfe',
  //     ],
  //     queue: 'main_queue',
  //     queueOptions: {
  //       durable: false,
  //     },
  //   },
  // });
  //
  // app1.listen().then(() => {
  //   console.log('Main listening');
  // });

  app.connectMicroservice({
    // port: 4000,
    transport: Transport.RMQ,
    options: {
      urls: [
        'amqps://lkgvypfe:FQyQTYsqweJ1xZTALzRW9eDfFjl7lqQX@mustang.rmq.cloudamqp.com/lkgvypfe',
      ],
      queue: 'main_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  // await app.startAllMicroservicesAsync();
  await app.startAllMicroservices();
}
bootstrap();

import { PeerServer } from 'peer';
const peerServer = PeerServer({ port: 9000, path: '/fld' });
peerServer.on('open', (id) => {
  console.log({ id });
});
