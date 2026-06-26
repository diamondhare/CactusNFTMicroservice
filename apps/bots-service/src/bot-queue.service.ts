import { BotsRedisService } from '@app/common/redis/bots/botsRedis.service';
import { QUEUE_NAMES } from '@app/queue';
import { RunBotJob } from '@app/queue/types/run-bot-job';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job, JobState, Queue } from 'bullmq';
import { BOT_BASE_JOB_DELAY_TIME } from './constants/bot.constants';

@Injectable()
export class BotsQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.BOTS)
    private readonly queue: Queue<RunBotJob>,
    private readonly botRedisService: BotsRedisService,
  ) {}

  async enqueue(botId: string): Promise<string> {
    const botIdleInfo = await this.botRedisService.botCheckIfIdle(botId);
    let delay = BOT_BASE_JOB_DELAY_TIME;
    if (botIdleInfo.isIdle && botIdleInfo.idleUntil > Date.now()) {
      delay = botIdleInfo.idleUntil - Date.now();
      console.log(`Bot ${botId} is idle for ${delay}`);
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
    console.log(`Enqueued bot with ID ${botId} as job ${job.id}`);
    return String(job.id);
  }

  async dequeue(botId: string): Promise<string> {
    const jobId = await this.findJobByBotId(botId);
    if (jobId === "") {
      return `Failed to stop job for botId ${botId}`;
    }
    const job = await this.queue.getJob(jobId);
    await job?.remove();
    return `Stopped job ${jobId} for bot ${botId}`;
  }

  private async findJobByBotId(botId: string): Promise<string> {
    const states: JobState[] = ['waiting', 'active', 'delayed'];
    const allJobs: Job[] = [];

    for(const state of states) {
      const jobs = await this.queue.getJobs(state);
      allJobs.push(...jobs);
    }
    console.log(JSON.stringify(allJobs))
    if(!allJobs.filter(job => job.id?.includes(botId))[0].id){
      return "";
    }
    return allJobs.filter(job => job.id?.includes(botId))[0].id!;
  }
}