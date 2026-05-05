import { Module } from '@nestjs/common';

import { SeedMintedEventProcessor } from './seed-minted-event.processor';

@Module({
  providers: [SeedMintedEventProcessor],
  exports: [SeedMintedEventProcessor],
})
export class EventProcessorsModule {}
