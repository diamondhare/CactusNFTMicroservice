import { Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';

import { EventProcessorsModule } from '../processors/event-processors.module';
import { EventRepositoriesModule } from '../repositories/event-repositories.module';
import { SeedMintedListener } from './seed-minted.listener';

@Module({
  imports: [BlockchainModule, EventProcessorsModule, EventRepositoriesModule],
  providers: [SeedMintedListener],
})
export class EventListenersModule {}
