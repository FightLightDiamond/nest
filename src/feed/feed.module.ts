import { CacheModule, Module } from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { FeedService } from './services/feed.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostRepository } from './repositories/post.repository';
import { AuthModule } from '../auth/auth.module';
import { IsCreatorGuard } from './guards/is-creator.guard';
import { CacheConfigAsync } from '../config/cache.config';
import PostsSearchService from './services/postsSearch.service';
import { SearchModule } from '../search/search.module';

@Module({
  imports: [
    SearchModule,
    AuthModule,
    TypeOrmModule.forFeature([PostRepository]),
    CacheModule.registerAsync(CacheConfigAsync),
  ],
  providers: [FeedService, IsCreatorGuard, PostsSearchService],
  controllers: [FeedController],
  exports: [FeedModule],
})
export class FeedModule {}
