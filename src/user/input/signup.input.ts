import {Field, InputType} from "@nestjs/graphql";
import {UserInterface} from "../user.interface";

@InputType({description: 'New recipe data'})
export class SignupInput implements Partial<UserInterface>{
  @Field() email: string
  @Field() password: string
}
