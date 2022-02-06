import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../repositories/post.repository';
import { FeedPost } from '../models/post.interface';
import { from, Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
  ) {}

  gets(take = 10, skip = 0): Observable<any> {
    return from(
      this.postRepository
        .findAndCount({ take, skip })
        .then(([posts, count]) => {
          return { data: <FeedPost[]>posts, count: count };
        }),
      // this.postRepository
      //   .createQueryBuilder()
      //   .take(take)
      //   .skip(skip)
      //   .getManyAndCount(),
    );
  }

  createPost(user: UserEntity, feedPost: FeedPost): Observable<FeedPost> {
    // feedPost.author = user;
    feedPost.authorId = user.id;
    // console.log({ user, feedPost });
    return from(this.postRepository.save(feedPost));
  }

  findAll(): Observable<FeedPost[]> {
    return from(this.postRepository.find());
  }

  find(id: number): Observable<FeedPost> {
    return from(this.postRepository.findOne(id, { relations: ['author'] }));
  }

  update(id: number, feedPost: FeedPost): Observable<UpdateResult> {
    return from(this.postRepository.update(id, feedPost));
  }

  delete(id: number): Observable<DeleteResult> {
    return from(this.postRepository.delete(id));
  }
}
