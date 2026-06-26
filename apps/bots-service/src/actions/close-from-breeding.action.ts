import { Injectable, Logger } from "@nestjs/common";
import { BotActionInterface } from "apps/bots-service/bot.action-interface";
import { CactusBreedingService } from "@app/blockchain/contracts/cactus-breeding/cactus-breeding.service";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BotActions } from "../enums/bot-actions-enum";
import { BotContext } from "apps/bots-service/types/bot-context.types";
import { GetValidCactusForBreedingClose } from "../db/get-valid-cactus-for-breeding-close";

@Injectable()
export class CloseForBreedingAction implements BotActionInterface {
    type = BotActions.CloseForBreeding;

    constructor(
        private readonly cactusBreedingService: CactusBreedingService,
        private readonly getValidCactusForBreedingClose: GetValidCactusForBreedingClose,
        private readonly botsRedisService: BotsRedisService,
    ) {}

    async canExecute(context: BotContext): Promise<boolean> {
        return context.cactiOpenFromBreeding > 0 && context.cactiCount > 0;
    }

    async getWeight(context: BotContext): Promise<number> {
        return 30;
    }

    async execute(context: BotContext): Promise<string> {
        Logger.log("Executing close for breeding action");
        await this.botsRedisService.botSetStatus(context.botId, BotActions.CloseForBreeding);
        const tx = await this.cactusBreedingService.closeForBreeding(BigInt(await this.getValidCactusForBreedingClose.getOne(context.walletAddress)));
        return tx;
    }
}