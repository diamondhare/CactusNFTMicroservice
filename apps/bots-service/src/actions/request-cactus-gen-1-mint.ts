import { Injectable, Logger } from '@nestjs/common';
import { BotActionInterface } from 'apps/bots-service/bot.action-interface';
import { BotsRedisService } from '@app/common/redis/bots/botsRedis.service';
import { BotActions } from '../enums/bot-actions-enum';
import { BotContext } from 'apps/bots-service/types/bot-context.types';
import { Queue } from 'bullmq';
import type {
  MintGen1CactusJob,
  MintGen1CactusResult,
} from '@app/queue/types/mint-gen1-cactus-job';
import {
  InjectQueue,
  QueueEventsHost,
  QueueEventsListener,
} from '@nestjs/bullmq';
import { JOB_NAMES, QUEUE_NAMES } from '@app/queue/queue.constants';
import { UpdateBotOwnedCacti } from '../db/update-bot-owned-cacti';

@QueueEventsListener(QUEUE_NAMES.MINT_GEN1_CACTUS)
export class MintGen1CactusQueueEventsListener extends QueueEventsHost {}

@Injectable()
export class RequestCactusGen1MintAction implements BotActionInterface {
  private readonly logger = new Logger(RequestCactusGen1MintAction.name);
  type = BotActions.RequestCactusMint;

  constructor(
    private readonly botsRedisService: BotsRedisService,
    @InjectQueue(QUEUE_NAMES.MINT_GEN1_CACTUS)
    private readonly queue: Queue<MintGen1CactusJob, MintGen1CactusResult>,
    private readonly mintQueueEvents: MintGen1CactusQueueEventsListener,
    private readonly updateBotOwnedCacti: UpdateBotOwnedCacti,
  ) {}

  canExecute(context: BotContext): Promise<boolean> {
    return Promise.resolve(context.cactiCount < 4);
  }

  getWeight(): Promise<number> {
    return Promise.resolve(60);
  }

  async execute(context: BotContext): Promise<string> {
    this.logger.log('Requesting cactus mint from game master');
    const dto: MintGen1CactusJob = {
      to: context.walletAddress,
    };

    const job = await this.queue.add(JOB_NAMES.MINT_GEN1_CACTUS, dto, {
      jobId: `mint-gen1-${context.botId}-${Date.now()}`,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5_000,
      },
      removeOnComplete: true,
      removeOnFail: true,
    });

    await this.botsRedisService.botSetStatus(context.botId, this.type);
    const result = await job.waitUntilFinished(
      this.mintQueueEvents.queueEvents,
    );
    await this.updateBotOwnedCacti.updateBalance(context.botId);
    return result.txHash;
  }
}
