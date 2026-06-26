import { Injectable, Logger } from "@nestjs/common";
import { BotActionInterface } from "apps/bots-service/bot.action-interface";
import { Cactus721Service } from "@app/blockchain/contracts/cactus721/cactus721.service";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BotActions } from "../enums/bot-actions-enum";
import { BotContext } from "apps/bots-service/types/bot-context.types";
import { GetValidCactusForTransfer } from "../db/get-valid-cactus-for-transfer";
import { GetValidTransferReceiver } from "../db/get-valid-transfer-receiver";
import { BotSignerProvider } from "@app/blockchain/providers/bot-signer.provider";
import { GetBotSecretKey } from "../db/get-bot-secret-key";

@Injectable()
export class TransferAction implements BotActionInterface {
    type = BotActions.Transfer;

    constructor(
        private readonly cactus721NFTService: Cactus721Service,
        private readonly getValidCactusForTransfer: GetValidCactusForTransfer,
        private readonly getValidTransferReceiver: GetValidTransferReceiver,
        private readonly getBotSecretKey: GetBotSecretKey,
        private readonly botsRedisService: BotsRedisService,
        private readonly botSignerProvider: BotSignerProvider,
    ) {}

    async canExecute(context: BotContext): Promise<boolean> {
        return context.cactiOpenFromBreeding < 2 && context.cactiCount > 0;
    }

    async getWeight(context: BotContext): Promise<number> {
        return 33;
    }

    async execute(context: BotContext): Promise<string> {
        Logger.log("Executing transfer action");
        await this.botsRedisService.botSetStatus(context.botId, BotActions.Transfer);
        const tokenIdToTransfer = await this.getValidCactusForTransfer.getOne(context.walletAddress);
        const chooseCactusRecieverAddress = await this.getValidTransferReceiver.getOne(context.botId);
        const botSecretKey = await this.getBotSecretKey.getOne(context.botId);
        // const botSecretKey = "0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"
        const botWalletInstance = await this.botSignerProvider.getSigner(botSecretKey);
        const approveTx = await this.cactus721NFTService.approve(chooseCactusRecieverAddress, BigInt(tokenIdToTransfer), botWalletInstance);
        Logger.log("approve tx: " + approveTx);
        const tx = await this.cactus721NFTService.transfer(context.walletAddress, chooseCactusRecieverAddress, BigInt(tokenIdToTransfer), botWalletInstance);
        Logger.log("transfer tx: " + tx);
        return tx;
    }
}