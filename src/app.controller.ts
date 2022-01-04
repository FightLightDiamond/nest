import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ExampleEmailServiceService } from './example-email-service/example-email-service.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly exampleEmailService: ExampleEmailServiceService,
  ) {}

  @Get()
  async getHello() {
    const res = await this.exampleEmailService.example();
    console.log({ res });
    return res;
    // return this.appService.getHello();
  }
}
