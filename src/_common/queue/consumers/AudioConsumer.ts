import { Processor, Process, OnQueueActive } from '@nestjs/bull';
import { Job } from 'bull';
import { Logger } from '@nestjs/common';

@Processor('audio')
export class AudioConsumer {
  private readonly logger = new Logger(AudioConsumer.name);

  @Process('transcode')
  handleTranscode(job: Job) {
    this.logger.debug('Start transcoding...');
    this.logger.debug(job.data);
    this.logger.debug('Transcoding completed');
  }

  @Process()
  async transcode(job: Job<unknown>) {
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    console.log(job.data);
    console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
}
