import { RoomI } from "../room/room.interface";
import {UserInterface} from "../../user/user.interface";


export interface JoinedRoomI {
  id?: number;
  socketId: string;
  user: UserInterface;
  room: RoomI;
}
