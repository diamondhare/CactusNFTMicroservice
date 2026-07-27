import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { JOB_NAMES, QUEUE_NAMES } from '@app/queue';
import type { MintGen1CactusJob, MintGen1CactusResult } from '@app/queue';
import { Queue } from 'bullmq';

import type { MintGen1CactusDto } from './dto/mint-gen1-cactus.dto';

@Injectable()
export class MintGen1CactusQueueService {
  constructor(
    @InjectQueue(QUEUE_NAMES.MINT_GEN1_CACTUS)
    private readonly queue: Queue<MintGen1CactusJob, MintGen1CactusResult>,
  ) {}

  async enqueue(dto: MintGen1CactusDto): Promise<string> {
    const job = await this.queue.add(JOB_NAMES.MINT_GEN1_CACTUS, dto, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5_000,
      },
      removeOnComplete: 1_000,
      removeOnFail: 5_000,
    });

    return String(job.id);
  }

  async getStatus(jobId: string) {
    const job = await this.queue.getJob(jobId);
    if (job === undefined) {
      throw new NotFoundException(`Mint job ${jobId} not found`);
    }

    return {
      jobId,
      state: await job.getState(),
      result: job.returnvalue ?? null,
      failedReason: job.failedReason || null,
    };
  }
}
