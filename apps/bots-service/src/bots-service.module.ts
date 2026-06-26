import { Logger, Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';
import { CommonModule } from '@app/common';
import { BotsActionHistoryEntity, DatabaseModule } from '@app/database';

import { BotsController } from '../bots.controller';
import { BotsQueueService } from './bot-queue.service';
import { BotProcessor } from './bot.processor';
import { BotContextService } from './bot.context';
import { CloseForBreedingAction } from './actions/close-from-breeding.action';
import { OpenForBreedingAction } from './actions/open-for-breeding.action';
import { TransferAction } from './actions/transfer.action';
import { RunBotQueueModule } from '@app/queue/run-bot-queue.module';
import { CactusBreedingService } from '@app/blockchain/contracts/cactus-breeding/cactus-breeding.service';
import { Cactus721Service } from '@app/blockchain/contracts/cactus721/cactus721.service';
import { BotsRedisService } from '@app/common/redis/bots/botsRedis.service';
import { GetBotContextById } from './db/get-bot-context-by-id';
import { BotsDataEntity } from '@app/database/entities/bots-data-entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BotActionSelector } from '../bot.selector';
import { BotEngine } from '../bot.engine';
import { SetBotIdle } from './actions/set-bot-idle.action';
import { WriteBotAction } from './db/write-bot-action';
import { DbBotModule } from './db/db-bot.module';
import { BotSignerProvider } from '@app/blockchain/providers/bot-signer.provider';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    BlockchainModule,
    RunBotQueueModule,
    DbBotModule,
    TypeOrmModule.forFeature([BotsDataEntity, BotsActionHistoryEntity])
  ],
  providers: [
    Logger, 
    BotsQueueService,
    BotsRedisService, 
    BotProcessor, 
    BotEngine, 
    BotContextService, 
    BotActionSelector, 
    CloseForBreedingAction, 
    OpenForBreedingAction, 
    TransferAction, 
    SetBotIdle,
    CactusBreedingService, 
    Cactus721Service,
    GetBotContextById,
    WriteBotAction,
    BotSignerProvider,
  ],
  controllers: [BotsController],
})
export class BotsServiceModule {}
