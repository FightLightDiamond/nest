import { EntityRepository, Repository } from 'typeorm';
import { Post } from '../models/post.entity';

@EntityRepository(Post)
export class PostRepository extends Repository<Post> {}
