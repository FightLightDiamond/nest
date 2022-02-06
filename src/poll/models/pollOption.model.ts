import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class PollOptionModel {
  @Field()
  id: number;

  @Field()
  text: string;

  @Field()
  votes: number;

  @Field()
  pollId: number;

  // poll: Promise<PollModel>; // generated a  pollId
}
