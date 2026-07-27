import { BotsRedisService } from '@app/common/redis/bots/botsRedis.service';
import { QUEUE_NAMES } from '@app/queue';
import { RunBotJob } from '@app/queue/types/run-bot-job';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job, JobState, Queue } from 'bullmq';
import { BOT_BASE_JOB_DELAY_TIME } from './constants/bot.constants';

@Injectable()
export class BotsQueueService {
  private readonly logger = new Logger(BotsQueueService.name);
  constructor(
    @InjectQueue(QUEUE_NAMES.BOTS)
    private readonly queue: Queue<RunBotJob>,
    private readonly botRedisService: BotsRedisService,
  ) {}

  async enqueue(botId: string, forceNext = false): Promise<string> {
    this.logger.log(`Enqueuing bot with ID ${botId}`);
    if (!(await this.botRedisService.botIsRunning(botId))) {
      return `Bot ${botId} is stopped`;
    }
    if (!forceNext) {
      const existingJobId = await this.findJobByBotId(botId);
      if (existingJobId) return existingJobId;
    }
    const botIdleInfo = await this.botRedisService.botCheckIfIdle(botId);
    let delay = BOT_BASE_JOB_DELAY_TIME;
    this.logger.log(`Bot ${botId} idle info: ${JSON.stringify(botIdleInfo)}`);
    if (botIdleInfo.isIdle && botIdleInfo.idleUntil > Date.now()) {
      delay = botIdleInfo.idleUntil - Date.now();
      this.logger.log(`Bot ${botId} is idle for ${delay}`);
    }
    const job = await this.queue.add(QUEUE_NAMES.BOTS, { botId }, {
      attempts: 1,
      jobId: botId + Date.now().toString(),
      backoff: {
        type: 'exponential',
        delay: 5_000,
      },
      removeOnComplete: true,
      removeOnFail: true,
      delay: delay,
    });
    this.logger.log(`Enqueued bot with ID ${botId} as job ${job.id}`);
    return String(job.id);
  }

  async dequeue(botId: string): Promise<string> {
    const jobs = await this.queue.getJobs(['waiting', 'delayed']);
    const botJobs = jobs.filter((job) => job.data.botId === botId);
    await Promise.all(botJobs.map((job) => job.remove()));
    return `Stopped bot ${botId}; removed ${botJobs.length} scheduled jobs`;
  }

  async isRunning(botId: string): Promise<boolean> {
    return this.botRedisService.botIsRunning(botId);
  }

  private async findJobByBotId(botId: string): Promise<string | undefined> {
    const states: JobState[] = ['waiting', 'active', 'delayed'];
    const allJobs: Job[] = [];

    for(const state of states) {
      const jobs = await this.queue.getJobs(state);
      allJobs.push(...jobs);
    }
    return allJobs.find((job) => job.data.botId === botId)?.id;
  }
}