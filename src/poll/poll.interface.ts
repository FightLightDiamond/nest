import {UserInterface} from "../user/user.interface";
import {PollOptionEntity} from "./pollOption.entity";
import {UserEntity} from "../user/user.entity";

export interface PollInterface {
  id?: number;
  name?: string;
  userId?: string;
  // user?: UserInterface;
  // pollOption?: PollOptionEntity[]
}
