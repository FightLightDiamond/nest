import {
  Body,
  CacheInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FeedService } from '../services/feed.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { Observable } from 'rxjs';
import { FeedPost } from '../models/post.interface';
import { JwtGuard } from '../../auth/guards/jwt.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { RoleEnum } from '../../auth/role.enum';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { UpdatePostDto } from '../dto/update-post.dto';
import { RolesGuard } from '../../auth/guards/roles.guard';

/**
 * Feed Controller
 */
@Controller('feed')
@UseInterceptors(CacheInterceptor)
export class FeedController {
  /**
   * Get Post
   *
   * @param feedService
   */
  constructor(private feedService: FeedService) {}

  /**
   * Get Post
   *
   * @param take
   * @param skip
   */
  @UseGuards(JwtGuard)
  @Get()
  gets(
    @Query('take') take = 10,
    @Query('skip') skip = 0,
  ): Observable<FeedPost[]> {
    return this.feedService.gets(take, skip);
  }

  /**
   * Create Post
   *
   * @param post
   * @param req
   */
  @Roles(RoleEnum.ADMIN, RoleEnum.PREMIUM)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/')
  @UsePipes(ValidationPipe)
  create(@Body() post: CreatePostDto, @Request() req): Observable<FeedPost> {
    return this.feedService.createPost(req.user, post);
  }

  /**
   * Update
   *
   * @param id
   * @param post
   */
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put('/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id, @Body() post: UpdatePostDto) {
    return this.feedService.update(id, post);
  }

  /**
   * Delete
   *
   * @param id
   */
  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete('/:id')
  delete(@Param('id') id) {
    return this.feedService.delete(id);
  }
}
