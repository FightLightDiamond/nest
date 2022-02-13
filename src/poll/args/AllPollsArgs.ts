import {ArgsType, Field} from "@nestjs/graphql";

@ArgsType()
export class AllPollsArgs {
  @Field()
  take: number

  @Field()
  skip: number
}
