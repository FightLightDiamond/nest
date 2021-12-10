import { IsNotEmpty, Length } from 'class-validator';
import { FeedPost } from '../models/post.interface';

export class UpdatePostDto implements FeedPost {
  @IsNotEmpty({ message: 'The body should have a text' })
  @Length(3, 255)
  body: string;
}
