import {Field, ObjectType, Int} from "@nestjs/graphql";
import {PollOptionModel} from "./pollOption.model";

@ObjectType()
export class PollModel {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  userId: string;

  @Field(type => [PollOptionModel!])
  pollOption?: PollOptionModel[];
}
