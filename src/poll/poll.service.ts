import {CACHE_MANAGER, Inject, Injectable} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { POLL_OPTION_ID_PREFIX } from '../constants';
// import { redis } from '../redis';
import { PollEntity } from './poll.entity';
import { PollRepository } from './poll.repository';
import {MyContextTypes} from "./types/myContext.types";
import {PollOptionRepository} from "./pollOption.repository";
import {Cache} from "cache-manager";

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(PollRepository)
    private readonly pollRepo: PollRepository,
    @InjectRepository(PollOptionRepository)
    private readonly pollOptionRepo: PollOptionRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}
  async createPoll(
    userId: string,
    name: string,
    options: string[],
  ): Promise<Boolean> {

      const poll = await this.pollRepo.save({
        name,
        userId,
      });
      debugger
      options.map(async (text: string) => {
        await this.pollOptionRepo.save({
          text,
          votes: 0,
          pollId: poll?.id,
        });
      });

    return true;
  }

  async vote(ctx: MyContextTypes, pollOptionId: number): Promise<Boolean> {
    const pollOption = await this.pollOptionRepo.findOne({
      where: { id: pollOptionId },
    });

    const ip =
      ctx.req.header('x-forwarded-for') || ctx.req.connection.remoteAddress;

    if (ip) {
      const hasIp = await this.cacheManager.get(
        `${POLL_OPTION_ID_PREFIX}${pollOption.pollId}${ip}`
      );
      if (hasIp) {
        return false;
      }
    }

    await this.pollOptionRepo.update(
      { id: pollOptionId },
      { votes: pollOption.votes + 1 },
    );

    await this.cacheManager.set(`${POLL_OPTION_ID_PREFIX}${pollOption.pollId}${ip}`, ip);
    return true;
  }

  async poll(id: number): Promise<PollEntity> {
    const poll =  await this.pollRepo.findOne({
      where: { id },
      relations: ['pollOption'],
    })

    debugger
    return poll
  }

  async allPolls(take: number, skip: number): Promise<PollEntity[]> {
    return this.pollRepo
      .createQueryBuilder('poll')
      .innerJoinAndSelect('poll.pollOption', 'pollOption')
      .orderBy('poll.name', 'ASC')
      .take(take)
      .skip(skip)
      .getMany();
  }

  async deletePoll(ctx: MyContextTypes, id: number): Promise<Boolean> {
    try {
      await this.pollRepo.delete({ id });
      const ip = ctx.req.header('x-forwarded-for') || ctx.req.connection.remoteAddress;

      await this.cacheManager.del(`${POLL_OPTION_ID_PREFIX}${id}${ip}`);
    } catch (err) {
      return false;
    }
    return true;
  }

  async myPoll(userId: string): Promise<PollEntity[]> {
    return await this.pollRepo.find({ where: { userId } });
  }
}
