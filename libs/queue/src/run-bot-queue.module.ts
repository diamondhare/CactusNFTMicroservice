import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { QUEUE_NAMES } from './queue.constants';
import { QueueModule } from './queue.module';

@Module({
  imports: [
    QueueModule,
    BullModule.registerQueue({
      name: QUEUE_NAMES.BOTS,
    }),
  ],
  exports: [BullModule],
})
export class RunBotQueueModule {}
