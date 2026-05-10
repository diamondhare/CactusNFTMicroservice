import { Body, Controller, Post } from '@nestjs/common';

import { MintGen1CactusDto } from './dto/mint-gen1-cactus.dto';
import { MintGen1CactusQueueService } from './mint-gen1-cactus-queue.service';

@Controller('admin/cactus')
export class MintGen1CactusController {
  constructor(
    private readonly mintGen1CactusQueueService: MintGen1CactusQueueService,
  ) {}

  @Post('mint-gen1')
  async mintGen1Cactus(@Body() dto: MintGen1CactusDto) {
    const jobId = await this.mintGen1CactusQueueService.enqueue(dto);

    return {
      jobId,
      status: 'queued',
    };
  }
}
