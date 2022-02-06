import {ArgsType, Field} from "@nestjs/graphql";

@ArgsType()
export class CreatePollArgs {
  @Field()
  name: string;

  @Field(() => [String])
  options: string[]
}
