import { Module } from '@nestjs/common';

import { BotStrategiesModule } from '../strategies/bot-strategies.module';
import { ExampleSeedTransferJob } from './example-seed-transfer.job';

@Module({
  imports: [BotStrategiesModule],
  providers: [ExampleSeedTransferJob],
})
export class BotJobsModule {}
