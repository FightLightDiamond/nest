import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { FeedService } from '../services/feed.service';
import { User } from '../../user/user.entity';
import { RoleEnum } from '../../auth/role.enum';
import { FeedPost } from '../models/post.interface';

@Injectable()
export class IsCreatorGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private feedService: FeedService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const { user, params }: { user: User; params: { id: number } } = request;

    if (!user || !params) return false;
    // allow admins to get make requests
    // if (user?.role == RoleEnum.ADMIN) return true;
    return this.feedService.find(params.id).pipe(
      map((post: FeedPost) => {
        return user.id == post?.author?.id;
      }),
    );
  }
}
