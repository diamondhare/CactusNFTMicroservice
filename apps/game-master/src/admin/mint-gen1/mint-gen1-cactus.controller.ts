import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { MintGen1CactusDto } from './dto/mint-gen1-cactus.dto';
import { MintGen1CactusQueueService } from './mint-gen1-cactus-queue.service';

@ApiTags('cactus mint')
@Controller('admin/cactus')
export class MintGen1CactusController {
  constructor(
    private readonly mintGen1CactusQueueService: MintGen1CactusQueueService,
  ) {}

  @Post('mint-gen1')
  @ApiOperation({ summary: 'Queue a random Gen1 cactus mint' })
  async mintGen1Cactus(@Body() dto: MintGen1CactusDto) {
    const jobId = await this.mintGen1CactusQueueService.enqueue(dto);
    return { jobId, status: 'queued' };
  }

  @Get('mint-gen1/:jobId')
  @ApiOperation({ summary: 'Get Gen1 mint job status and transaction result' })
  getMintStatus(@Param('jobId') jobId: string) {
    return this.mintGen1CactusQueueService.getStatus(jobId);
  }
}
