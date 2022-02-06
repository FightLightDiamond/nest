import {Field, ObjectType} from "@nestjs/graphql";
import {PollInterface} from "../poll.interface";
import {UserInterface} from "../../user/user.interface";
import {PollOptionEntity} from "../pollOption.entity";
import {UserEntity} from "../../user/user.entity";

@ObjectType()
export class PollTypes implements PollInterface {
  @Field() id?: number;
  @Field() name?: string;
  @Field() userId?: string;
  @Field() user?: UserEntity;
  @Field() pollOption?: [PollOptionEntity]
}
