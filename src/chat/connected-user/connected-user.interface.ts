import {UserInterface} from "../../user/user.interface";

export interface ConnectedUserI {
  id?: number;
  socketId: string;
  user: UserInterface;
}
