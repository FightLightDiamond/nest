import * as DataLoader from 'dataloader';
import { Request, Response } from 'express';
import {PollOptionEntity} from "../pollOption.entity";


export interface MyContextTypes {
  req: Request;
  res: Response;
  pollOptionLoader: DataLoader<number, PollOptionEntity[]>;
}
