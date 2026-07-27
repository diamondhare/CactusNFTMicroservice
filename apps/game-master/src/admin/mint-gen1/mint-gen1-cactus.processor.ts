import { Logger } from '@nestjs/common';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '@app/queue';
import type { MintGen1CactusJob } from '@app/queue';
import { generateRandomGen1CactusGenome } from '@app/blockchain';
import type { Job } from 'bullmq';

import { CactusAdminService } from './mint-gen1-cactus.service';

@Processor(QUEUE_NAMES.MINT_GEN1_CACTUS, {
  concurrency: 1,
})
export class MintGen1CactusProcessor extends WorkerHost {
  private readonly logger = new Logger(MintGen1CactusProcessor.name);

  constructor(private readonly cactusAdminService: CactusAdminService) {
    super();
  }

  async process(job: Job<MintGen1CactusJob>) {
    let genome = job.data.genome;
    if (genome === undefined) {
      const generated = generateRandomGen1CactusGenome();
      genome = generated.genomeHex;
      await job.updateData({ ...job.data, genome });
      this.logger.log(
        `Generated random V1 genome ${genome} for mint job ${job.id}`,
      );
    }

    this.logger.log(
      `Processing mintGen1Cactus job ${job.id} for ${job.data.to} with genome ${genome}`,
    );
    const txHash = await this.cactusAdminService.mintGen1Cactus({
      ...job.data,
      genome,
    });

    this.logger.log(`mintGen1Cactus job ${job.id} completed: ${txHash}`);
    return { txHash, genome };
  }
}
