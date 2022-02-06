import { EntityRepository, Repository } from 'typeorm';
import {PollOptionEntity} from "./pollOption.entity";

@EntityRepository(PollOptionEntity)
export class PollOptionRepository extends Repository<PollOptionEntity>  {

}
