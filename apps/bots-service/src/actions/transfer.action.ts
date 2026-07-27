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
import { UpdateBotOwnedCacti } from "../db/update-bot-owned-cacti";

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
        private readonly updateBotOwnedCacti: UpdateBotOwnedCacti,
    ) {}

    async canExecute(context: BotContext): Promise<boolean> {
        return context.cactiOpenFromBreeding < 2 && context.cactiCount > 0;
    }

    async getWeight(context: BotContext): Promise<number> {
        return 33;
    }

    async execute(context: BotContext): Promise<string> {
        Logger.log("Executing transfer action");
        await this.botsRedisService.botSetStatus(context.botId, this.type);

        const botSecretKey = await this.getBotSecretKey.getOne(context.botId);
        const botWalletInstance = await this.botSignerProvider.getSigner(botSecretKey);
        const candidates = await this.getValidCactusForTransfer.getAll(context.walletAddress);
        let tokenIdToTransfer: string | undefined;

        for (const candidate of candidates) {
            try {
                const actualOwner = await this.cactus721NFTService.ownerOf(BigInt(candidate), botWalletInstance);
                if (actualOwner.toLowerCase() === context.walletAddress.toLowerCase()) {
                    tokenIdToTransfer = candidate;
                    break;
                }
                await this.getValidCactusForTransfer.updateOwner(candidate, actualOwner);
                Logger.warn("Repaired stale owner for cactus " + candidate + ": " + actualOwner);
            } catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                Logger.warn("Skipping invalid cactus " + candidate + ": " + message);
            }
        }

        if (tokenIdToTransfer === undefined) {
            throw new Error("No on-chain owned cactus available for transfer for bot " + context.botId);
        }

        const receiver = await this.getValidTransferReceiver.getOne(context.botId);
        const tx = await this.cactus721NFTService.transfer(
            context.walletAddress,
            receiver.walletAddress,
            BigInt(tokenIdToTransfer),
            botWalletInstance,
        );
        Logger.log("transfer tx: " + tx);

        await this.getValidCactusForTransfer.updateOwner(tokenIdToTransfer, receiver.walletAddress);
        await Promise.all([
            this.updateBotOwnedCacti.updateBalance(context.botId),
            this.updateBotOwnedCacti.updateBalance(receiver.botId),
        ]);
        return tx;
    }
}