import * as DataLoader from "dataloader";
import {getRepository} from "typeorm";
import {PollEntity} from "../poll.entity";

export const pollOptionLoader = () => {
  return new DataLoader(async (keys: number[]) => {
    const poll = await getRepository(PollEntity)
      .createQueryBuilder('poll')
      .leftJoinAndSelect('poll.pollOption', 'pollOption')
      .where('poll.id IN (:...keys)', {keys})
      .getMany();
    return poll.map(poll => poll.pollOption);
  })
}
