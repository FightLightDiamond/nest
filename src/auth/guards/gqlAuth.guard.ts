import {ExecutionContext, Injectable} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {GqlExecutionContext} from "@nestjs/graphql";

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    // console.log("gql simple context: ", context);
    // console.log("gqlContext: ", ctx.getContext());
    // console.log("gqlContext req: ", ctx.getContext().req);
    return ctx.getContext().req;
  }
}
