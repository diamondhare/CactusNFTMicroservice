import { Logger, Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';
import { CommonModule } from '@app/common';
import { DatabaseModule } from '@app/database';

import { BotJobsModule } from './jobs/bot-jobs.module';
import { BotStrategiesModule } from './strategies/bot-strategies.module';
import { BotWalletsModule } from './wallets/bot-wallets.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    BlockchainModule,
    BotStrategiesModule,
    BotWalletsModule,
    BotJobsModule,
  ],
  providers: [Logger],
})
export class BotsServiceModule {}
