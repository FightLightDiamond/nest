import {Controller, Get, Headers, HttpException, Render} from '@nestjs/common';
import { AppService } from './app.service';
import { ExampleEmailServiceService } from './example-email-service/example-email-service.service';
import * as fs from 'fs';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly exampleEmailService: ExampleEmailServiceService,
  ) {}

  @Get()
  async getHello() {
    const res = await this.exampleEmailService.example();

    const exec = require('child_process').exec;
    exec('touch abc.xxzz', function(error, stdout, stderr) {
      console.log(stdout); }
    );

    return res;
    // return this.appService.getHello();
  }

  @Get('/video')
  video(@Headers() header) {
    const range = header.range;
    if (!range) {
      return new HttpException('Requires Range header', 400);
    }

    const videoPath = '';
    const videoSize = fs.statSync('').size;

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, ''));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
    };
  }

  @Get('/home')
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
