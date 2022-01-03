import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('*/50 * * * * *', {
    name: 'notifications',
  })
  handleCron() {
    this.logger.debug('Called when the current second is 5: ' + Date.now());
    // this.logger.debug(
    //   'Called when the current second is 5: ' + new Date().getDate(),
    // );
    // this.logger.debug(
    //   'Called when the current second is 5: ' + new Date().toISOString(),
    // );
  }
}
