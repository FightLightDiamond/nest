import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync(typeormConfigAsync),
    HttpModule,
    CsvModule,
    // TypeOrmModule.forRoot(typeormConfig),
    QuizModule,
    UserModule,
    BusinessSectorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
