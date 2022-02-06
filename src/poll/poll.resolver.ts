import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {PollService} from "./poll.service";
import {Get, Request, UseGuards} from "@nestjs/common";
import {JwtGuard} from "../auth/guards/jwt.guard";
import {GqlAuthGuard} from "../auth/guards/gqlAuth.guard";
import {GetUserIdDecorator} from "./getUserId.decorator";
import {CreatePollArgs} from "./args/createPoll.args";
import {Connection, getConnection, Transaction} from "typeorm";
import {Exception} from "handlebars";
import {MyContextTypes} from "./types/myContext.types";
import {PollEntity} from "./poll.entity";
import {PollTypes} from "./types/poll.types";
import {PollModel} from "./models/poll.model";
// import {GqlAuthGuard} from "../_app/guards/gqlAuth.guard";


@Resolver('Poll')
export class PollResolver {
  constructor(private readonly pollService: PollService, private connection: Connection) {
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async createPoll(
    @Args() {name, options}: CreatePollArgs,
    @GetUserIdDecorator() userId: string
  ): Promise<Boolean> {
    debugger
    const queryRunner = this.connection.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.pollService.createPoll(userId, name, options)
      return true
    } catch (e) {
      console.log('Exception')
      await queryRunner.rollbackTransaction();
      return false
    } finally {
      // you need to release a queryRunner which was manually instantiated
      await queryRunner.release();
    }
  }

  @Mutation(() => Boolean)
  async vote(
    @Context() ctx: MyContextTypes,
    @Args('pollOptionId') pollOptionId: number,
  ): Promise<Boolean> {
    return this.pollService.vote(ctx, pollOptionId)
  }

  @Query(() => PollEntity)
  async poll(@Args('id') id: number): Promise<PollEntity> {
    return this.pollService.poll(id)
  }
}
