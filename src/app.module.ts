import {
  CacheModule,
  HttpModule,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfigAsync } from './config/typeorm.config';
import { QuizModule } from './quiz/quiz.module';
import { UserModule } from './user/user.module';
import { BusinessSectorModule } from './business-sector/business-sector.module';
import { CsvModule } from 'nest-csv-parser';
import { ConfigModule } from '@nestjs/config';
import { FeedModule } from './feed/feed.module';
import { AuthModule } from './auth/auth.module';
import { ConnectModule } from './connect/connect.module';
// import { APP_FILTER } from '@nestjs/core';
// import { AllExceptionsFilter } from './_common/exceptions/all-exceptions.filter';
import { ChatModule } from './chat/chat.module';
import { CacheConfigAsync } from './config/cache.config';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks-service/tasks-service.service';
import { BullModule } from '@nestjs/bull';
import { queueConfigAsync } from './config/queue.config';
import { AudioConsumer } from './_common/queue/consumers/AudioConsumer';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { OrderCreatedListener } from './_common/observers/listeners/OrderCreatedListener';
import { ProductModule } from './product/product.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ExampleEmailServiceService } from './example-email-service/example-email-service.service';
import { LoggerMiddleware } from './logger.middleware';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfirmEmailService } from './user/email/confirmEmail.service';
import { GqlAuthGuard } from './auth/guards/gqlAuth.guard';
import { PollModule } from './poll/poll.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { pollOptionLoader } from './poll/loaders/pollOptionLoader';
// import {PollModule} from "./poll/poll.module";
import * as Joi from '@hapi/joi';
import { PostgresConfigAsync } from './config/postgres.config';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        AWS_PRIVATE_BUCKET_NAME: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      debug: true,
      playground: true,
      installSubscriptionHandlers: true,
      autoSchemaFile: 'schema.gql',
      context: ({ req, res }) => ({
        req,
        res,
        pollOptionLoader: pollOptionLoader(),
      }),
    }),
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // // Mysql
    // TypeOrmModule.forRootAsync(typeormConfigAsync),
    // PostgresConfigAsync
    TypeOrmModule.forRootAsync(PostgresConfigAsync),
    //Mongo
    // MongooseModule.forRoot('mongodb://localhost:27017/nest_main', {
    //   autoCreate: true,
    // }),
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
    //email
    MailerModule.forRoot({
      transport:
        'smtps://phamminhcuong1704bnfrv@gmail.com:vincent1704BN@smtp.gmail.com',
      defaults: {
        from: '"nest-modules" <modules@nestjs.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    PollModule,
    //Search Module
    SearchModule,
    //guard
    // GqlAuthGuard
  ],
  controllers: [AppController],
  providers: [
    AppService,
    //Handle Exception
    // {
    //   provide: APP_FILTER,
    //   useClass: AllExceptionsFilter,
    // },
    TasksService,
    AudioConsumer,
    OrderCreatedListener,
    ExampleEmailServiceService,
    ConfirmEmailService,
  ],
})
export class AppModule implements NestModule {
  // apply middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('home');
    // .forRoutes({ path: 'home', method: RequestMethod.ALL })
  }
}
