import { QUEUE_NAMES } from '@app/queue';
import { RunBotJob } from '@app/queue/types/run-bot-job';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BotsQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.BOTS)
    private readonly queue: Queue<RunBotJob>,
  ) {}

  async enqueue(botId: string): Promise<string> {
    const job = await this.queue.add(QUEUE_NAMES.BOTS, { botId }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5_000,
      },
      removeOnComplete: 1_000,
      removeOnFail: 5_000,
      delay: 20_000,
    });
    console.log(`Enqueued bot with ID ${botId} as job ${job.id}`);
    return String(job.id);
  }
}