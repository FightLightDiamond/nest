import { OnEvent } from '@nestjs/event-emitter';

export class OrderCreatedListener {
  @OnEvent('order.created')
  handleOrderCreatedEvent(payload: any) {
    console.log('>>>>>>>>>>>>>>>>EVENT<<<<<<<<<<<', payload);
    // handle and process "OrderCreatedEvent" event
  }
}
