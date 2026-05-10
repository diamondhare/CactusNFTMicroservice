import { Module } from '@nestjs/common';

import { CactusMintedEventProcessor } from './gen1-cactus-minted.processor';

@Module({
  providers: [CactusMintedEventProcessor],
  exports: [CactusMintedEventProcessor],
})
export class EventProcessorsModule {}
