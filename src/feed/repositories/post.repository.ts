import { EntityRepository, Repository } from 'typeorm';
import { PostEntity } from '../models/post.entity';

@EntityRepository(PostEntity)
export class PostRepository extends Repository<PostEntity> {}
