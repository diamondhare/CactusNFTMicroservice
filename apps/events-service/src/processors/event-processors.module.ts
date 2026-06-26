import { Module } from '@nestjs/common';

import { CactusMintedEventProcessor } from './gen1-cactus-minted.processor';
import { TransferEventProcessor } from './transfer.processor';

@Module({
  providers: [CactusMintedEventProcessor, TransferEventProcessor],
  exports: [CactusMintedEventProcessor, TransferEventProcessor],
})
export class EventProcessorsModule {}
