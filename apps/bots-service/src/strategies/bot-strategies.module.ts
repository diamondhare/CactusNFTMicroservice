import { Module } from '@nestjs/common';

import { BotWalletsModule } from '../wallets/bot-wallets.module';
import { OpenForBreedingStrategy } from './openForBreeding/open-for-breeding.strategy';
import { SeedTransferStrategy } from './seedTransfer/seed-transfer.strategy';

@Module({
  imports: [BotWalletsModule],
  providers: [SeedTransferStrategy, OpenForBreedingStrategy],
  exports: [SeedTransferStrategy, OpenForBreedingStrategy],
})
export class BotStrategiesModule {}
