import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {SignupInput} from "./input/signup.input";
import {UserService} from "./user.service";
import {ErrorResponse} from "./shared/errorResponse";
import {LoginInput} from "./input/login.input";
// import {MyContext} from "./types/myContext";

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {
  }

  @Query(() => String)
  async hello() {
    return 'Hello world'
  }

  @Mutation(() => [ErrorResponse], {nullable: true})
  async signup(
    @Args('signupInput') signupInput: SignupInput,
  ): Promise<ErrorResponse[] | null> {
    return await this.userService.signup(signupInput)
  }

  @Mutation(() => ([ErrorResponse] || String), {nullable: true})
  async login(
    @Args('loginInput') loginInput: LoginInput,
  ): Promise<ErrorResponse[] | string> {
    try {
      return await this.userService.login(loginInput)
    } catch (e) {
      return 'error'
    }
  }

  // @Mutation(() => Boolean)
  // async logout(@Context() ctx: MyContext) {
  //   await ctx.req.session.destroy((err) => {
  //     console.log(err)
  //   })
  //
  //   // ctx.res.clearCookie('votinapp')
  //   return true
  // }
}
