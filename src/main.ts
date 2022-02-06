import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as morgan from 'morgan';
// import { VersioningType } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
// import { WinstonModule } from 'nest-winston';
// import winston from 'winston';
import { join } from 'path';
import * as Store from 'connect-redis'
import * as session from 'express-session'
import {redis} from "./redis";
import {NestExpressApplication} from "@nestjs/platform-express";
const logStream = fs.createWriteStream('api.log', {
  flags: 'a',
});


import { PeerServer } from 'peer';

/**
 * PeerServer
 */
const peerServer = PeerServer({ port: 9000, path: '/fld' });

peerServer.on('open', (id) => {
  console.log({ id });
});
peerServer.on('stream', (stream) => {
  console.log({ stream });
});

/**
 * Bootstrap
 */
async function bootstrap() {
  const RedisStore = Store(session)

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });
  //cors
  app.enableCors();
  app.setGlobalPrefix('api');
  app.use(morgan('tiny', { stream: logStream }));
  //session
  app.use(session({
    store: new RedisStore({
      client: redis as any
    }),
    name: 'votinapp',
    secret: 'secret',
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_EVV === 'production',
      // expires: true,
      maxAge: 1000 * 60 * 60 * 365 * 24
    }
  }))
  await app.listen(4000);

  // Microservice
  app.connectMicroservice({
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

  // apply view
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
}

bootstrap();
