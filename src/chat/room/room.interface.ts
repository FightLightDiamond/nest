import {UserInterface} from "../../user/user.interface";


export interface RoomI {
  id?: number;
  name?: string;
  description?: string;
  users?: UserInterface[];
  created_at?: Date;
  updated_at?: Date;
}
