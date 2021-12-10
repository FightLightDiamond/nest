import { Module } from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { FeedService } from './services/feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './repositories/post.repository';
import { AuthModule } from '../auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';

@Module({
  imports: [AuthModule, TypeOrmModule.forFeature([PostRepository])],
  providers: [FeedService, IsCreatorGuard],
  controllers: [FeedController],
})
export class FeedModule {}
