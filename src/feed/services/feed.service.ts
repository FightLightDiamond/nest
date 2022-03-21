import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostRepository } from '../repositories/post.repository';
import { FeedPost } from '../models/post.interface';
import { from, Observable } from 'rxjs';
import { DeleteResult, In, UpdateResult } from 'typeorm';
import { UserEntity } from '../../user/user.entity';
import PostsSearchService from './postsSearch.service';
import { PostEntity } from '../models/post.entity';
import { map } from 'rxjs/operators';

/**
 * Feed Service
 */
@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(PostRepository)
    private readonly postRepository: PostRepository,
    private postsSearchService: PostsSearchService,
  ) {}

  async searchForPosts(text: string) {
    const results = await this.postsSearchService.search(text);
    // const ids = results.map((result) => result.id);
    // if (!ids.length) {
    //   return [];
    // }
    // return this.postRepository.find({
    //   where: { id: In(ids) },
    // });
    // return results;
    return 1234;
  }

  /**
   * GET
   * @param take
   * @param skip
   */
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

  /**
   * Create Post
   * @param user
   * @param feedPost
   */
  createPost(user: UserEntity, feedPost: FeedPost): Observable<FeedPost> {
    // feedPost.author = user;
    feedPost.authorId = user.id;
    // console.log({ user, feedPost });
    return from(this.postRepository.save(feedPost)).pipe(
      map((post: PostEntity) => {
        this.postsSearchService.indexPost(post);
        return post;
      }),
    );
  }

  /**
   * Find All
   */
  findAll(): Observable<FeedPost[]> {
    return from(this.postRepository.find());
  }

  /**
   * Find by ID
   * @param id
   */
  find(id: number): Observable<FeedPost> {
    return from(this.postRepository.findOne(id, { relations: ['author'] }));
  }

  /**
   * Update by Id
   * @param id
   * @param feedPost
   */
  update(id: number, feedPost: FeedPost): Observable<UpdateResult> {
    return from(this.postRepository.update(id, feedPost));
  }

  /**
   * Delete by ID
   * @param id
   */
  delete(id: number): Observable<DeleteResult> {
    return from(this.postRepository.delete(id));
  }

  async deletePost(id: number) {
    const deleteResponse = await this.postRepository.delete(id);
    if (!deleteResponse.affected) {
      throw new NotFoundException(id);
    }
    await this.postsSearchService.remove(id);
  }

  async updatePost(id: number, post) {
    await this.postRepository.update(id, post);
    const updatedPost = await this.postRepository.findOne(id, {
      relations: ['author'],
    });
    if (updatedPost) {
      await this.postsSearchService.update(updatedPost);
      return updatedPost;
    }
    throw new NotFoundException(id);
  }
}
