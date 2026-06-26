import { Module } from "@nestjs/common";
import { GetWalletInstanceByBotId } from "./get-wallet-instance-by-bot-id";
import { GetValidCactusForBreedingOpen } from "./get-valid-cactus-for-breeding-open";
import { GetValidCactusForTransfer } from "./get-valid-cactus-for-transfer";
import { GetValidTransferReceiver } from "./get-valid-transfer-receiver";
import { GetValidCactusForBreedingClose } from "./get-valid-cactus-for-breeding-close";
import { GetBotContextById } from "./get-bot-context-by-id";
import { WriteBotAction } from "./write-bot-action";
import { CactusNftDataEntity } from "@app/database/entities/cactus-nft-data-entity";
import { BotsActionHistoryEntity } from "@app/database/entities/bots-action-history-entity";
import { BotsDataEntity } from "@app/database/entities/bots-data-entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GetBotSecretKey } from "./get-bot-secret-key";

@Module({
    imports: [TypeOrmModule.forFeature([BotsDataEntity, BotsActionHistoryEntity, CactusNftDataEntity])],
    providers: [GetValidCactusForBreedingOpen, GetValidCactusForBreedingClose, GetValidCactusForTransfer, GetValidTransferReceiver, GetBotContextById, WriteBotAction, GetWalletInstanceByBotId, GetBotSecretKey],
    exports: [GetValidCactusForBreedingOpen, GetValidCactusForBreedingClose, GetValidCactusForTransfer, GetValidTransferReceiver, GetBotContextById, WriteBotAction, GetWalletInstanceByBotId,GetBotSecretKey]
})
export class DbBotModule {}