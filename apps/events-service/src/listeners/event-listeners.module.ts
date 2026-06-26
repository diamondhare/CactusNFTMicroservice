import { Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';

import { EventProcessorsModule } from '../processors/event-processors.module';
import { EventRepositoriesModule } from '../repositories/event-repositories.module';
import { Gen1CactusMintedListener } from './gen1-cactus-minted.listener';
import { TransferListener } from './transfer.listener';

@Module({
  imports: [BlockchainModule, EventProcessorsModule, EventRepositoriesModule],
  providers: [Gen1CactusMintedListener, TransferListener],
})
export class EventListenersModule {}
