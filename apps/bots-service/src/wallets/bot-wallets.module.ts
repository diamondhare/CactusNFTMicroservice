import { Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';

import { BotWalletsService } from './bot-wallets.service';

@Module({
  imports: [BlockchainModule],
  providers: [BotWalletsService],
  exports: [BotWalletsService],
})
export class BotWalletsModule {}
