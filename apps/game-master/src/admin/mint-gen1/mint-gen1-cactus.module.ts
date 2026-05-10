import { Module } from '@nestjs/common';
import { MintGen1QueueModule } from '@app/queue';

import { MintGen1CactusController } from './mint-gen1-cactus.controller';
import { MintGen1CactusQueueService } from './mint-gen1-cactus-queue.service';

@Module({
  imports: [MintGen1QueueModule],
  controllers: [MintGen1CactusController],
  providers: [MintGen1CactusQueueService],
})
export class MintGen1CactusModule {}
