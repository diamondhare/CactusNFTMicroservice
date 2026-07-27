import { BotsActionHistoryEntity } from '@app/database';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BotActions } from '../enums/bot-actions-enum';

@Injectable()
export class GetRecentBotActions {
  constructor(
    @InjectRepository(BotsActionHistoryEntity)
    private readonly repository: Repository<BotsActionHistoryEntity>,
  ) {}

  async getRecent(limit = 16) {
    const take = Math.min(Math.max(limit, 1), 50);
    const actions = await this.repository
      .createQueryBuilder('history')
      .select([
        'history.id',
        'history.botId',
        'history.action',
        'history.transactionHash',
        'history.jobId',
      ])
      .where('history.action IN (:...actions)', {
        actions: [
          BotActions.Transfer,
          BotActions.OpenForBreeding,
          BotActions.CloseForBreeding,
        ],
      })
      .orderBy('RIGHT(history."jobId", 13)::bigint', 'DESC')
      .limit(take)
      .getMany();

    return actions.map((action) => ({
      ...action,
      timestamp: Number(action.jobId.slice(-13)),
    }));
  }
}
