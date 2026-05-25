import { Injectable, Logger } from "@nestjs/common";
import { BotActionInterface } from "apps/bots-service/bot.action-interface";
import { Cactus721Service } from "@app/blockchain/contracts/cactus721/cactus721.service";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BotActions } from "../enums/bot-actions-enum";
import { BotContext } from "apps/bots-service/types/bot-context.types";

@Injectable()
export class TransferAction implements BotActionInterface {
    type = "transfer";

    constructor(
        private readonly cactus721NFTService: Cactus721Service,
        private readonly botsRedisService: BotsRedisService,
    ) {}

    async canExecute(context: BotContext): Promise<boolean> {
        return context.cactiOpenFromBreeding < 2 && context.cactiCount > 0;
    }

    async getWeight(context: BotContext): Promise<number> {
        return 30;
    }

    async execute(context: BotContext) {
        Logger.log("Executing transfer action");
        await this.botsRedisService.botSetStatus(context.botId, BotActions.Transfer);
        // const tokenIdToTransfer = chooseCactusToTransfer(context.walletAddress);
        // const chooseCactusRecieverAddress = "0x1234567890123456789012345678901234567890"; // TODO: choose a valid address
        // await this.cactus721NFTService.approve(chooseCactusRecieverAddress, tokenIdToTransfer, context.wallet);
        // await this.cactus721NFTService.transfer(tokenIdToTransfer, context.walletAddress);
    }
}