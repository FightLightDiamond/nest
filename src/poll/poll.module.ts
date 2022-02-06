import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PollRepository} from "./poll.repository";
import {PollOptionRepository} from "./pollOption.repository";
import {PollService} from "./poll.service";
import {PollResolver} from "./poll.resolver";

@Module({
  imports: [
    TypeOrmModule.forFeature([PollRepository, PollOptionRepository]),
  ],
  providers: [
    PollService,
    PollResolver
  ]
})
export class PollModule {}
