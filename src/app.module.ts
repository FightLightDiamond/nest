import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigAsync } from './config/typeorm.config';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';
import { BusinessSectorModule } from './business-sector/business-sector.module';
import { CsvModule } from 'nest-csv-parser';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { ConnectModule } from './connect/connect.module';
import { APP_FILTER } from '@nestjs/core';
import { AllExceptionsFilter } from './_app/exceptions/all-exceptions.filter';
import { ChatModule } from './chat/chat.module';
import { CacheConfigAsync } from './config/cache.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks-service/tasks-service.service';
import { BullModule } from '@nestjs/bull';
import { queueConfigAsync } from './config/queue.config';
import { AudioConsumer } from './_app/queue/consumers/AudioConsumer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderCreatedListener } from './_app/observers/listeners/OrderCreatedListener';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // Mysql
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    HttpModule,
    CsvModule,
    // TypeOrmModule.forRoot(typeormConfig),
    QuizModule,
    UserModule,
    BusinessSectorModule,
    FeedModule,
    AuthModule,
    ConnectModule,
    ChatModule,
    //Cache
    CacheModule.registerAsync(CacheConfigAsync),
    ScheduleModule.forRoot(),
    //Queue
    BullModule.forRootAsync(queueConfigAsync),
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
    BullModule.registerQueue(
      {
        name: 'audio',
      },
      {
        name: 'video',
      },
    ),
    EventEmitterModule.forRoot(),
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    TasksService,
    AudioConsumer,
    OrderCreatedListener,
  ],
})
export class AppModule {}
