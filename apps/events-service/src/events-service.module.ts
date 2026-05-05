import { Logger, Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';
import { CommonModule } from '@app/common';
import { DatabaseModule } from '@app/database';

import { EventListenersModule } from './listeners/event-listeners.module';
import { EventProcessorsModule } from './processors/event-processors.module';
import { EventRepositoriesModule } from './repositories/event-repositories.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    BlockchainModule,
    EventListenersModule,
    EventProcessorsModule,
    EventRepositoriesModule,
  ],
  providers: [Logger],
})
export class EventsServiceModule {}
