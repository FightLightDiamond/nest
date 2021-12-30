import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class AppService {
  constructor(
    @InjectQueue('audio') private audioQueue: Queue,
    private eventEmitter: EventEmitter2,
  ) {}
  async getHello() {
    try {
      //Queue
      const job = await this.audioQueue.add({
        foo: 'xxx',
      });
      const transcode = await this.audioQueue.add(
        'transcode',
        {
          foo: 'bar',
        },
        { delay: 3000 },
      );
      //Event
      this.eventEmitter.emit('order.created', {
        orderId: 1,
        payload: {},
      });
    } catch (e) {
      console.log({ e });
    }
    // return job;
    return 'Hello World!';
  }
}
