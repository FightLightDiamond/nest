import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
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
import { RolesGuard } from '../../auth/guards/roles.guard';
import { IsCreatorGuard } from '../guards/is-creator.guard';
import { UpdatePostDto } from '../dto/update-post.dto';

@Controller('feed')
export class FeedController {
  constructor(private feedService: FeedService) {}

  @UseGuards(JwtGuard)
  @Get()
  gets(
    @Query('take') take = 1,
    @Query('skip') skip = 1,
  ): Observable<FeedPost[]> {
    return this.feedService.gets(take, skip);
  }

  @Roles(RoleEnum.ADMIN, RoleEnum.PREMIUM)
  @UseGuards(JwtGuard, RolesGuard)
  @Post('/')
  @UsePipes(ValidationPipe)
  create(@Body() post: CreatePostDto, @Request() req): Observable<FeedPost> {
    return this.feedService.createPost(req.user, post);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Put('/:id')
  @UsePipes(ValidationPipe)
  update(@Param('id') id, @Body() post: UpdatePostDto) {
    debugger;
    return this.feedService.update(id, post);
  }

  @UseGuards(JwtGuard, IsCreatorGuard)
  @Delete('/:id')
  delete(@Param('id') id) {
    return this.feedService.delete(id);
  }
}
