import { Logger, Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';
import { CommonModule } from '@app/common';
import { DatabaseModule } from '@app/database';

import { BotsController } from '../bots.controller';
import { BotsQueueService } from './bot-queue.service';
import { BotProcessor } from './bot.processor';
import { BotEngine } from '../bot.engine';
import { BotContextService } from './bot.context';
import { BotActionSelector } from '../bot.selector';
import { CloseForBreedingAction } from './actions/close-from-breeding.action';
import { OpenForBreedingAction } from './actions/open-for-breeding.action';
import { TransferAction } from './actions/transfer.action';
import { RunBotQueueModule } from '@app/queue/run-bot-queue.module';
import { CactusBreedingService } from '@app/blockchain/contracts/cactus-breeding/cactus-breeding.service';
import { Cactus721Service } from '@app/blockchain/contracts/cactus721/cactus721.service';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    BlockchainModule,
    RunBotQueueModule
  ],
  providers: [Logger, BotsQueueService, BotProcessor, BotEngine, BotContextService, BotActionSelector, CloseForBreedingAction, OpenForBreedingAction, TransferAction, CactusBreedingService, Cactus721Service],
  controllers: [BotsController],
})
export class BotsServiceModule {}
