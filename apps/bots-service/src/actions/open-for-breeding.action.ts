import { Injectable, Logger } from "@nestjs/common";
import { BotContext } from "../bot.context";
import { BotActionInterface } from "apps/bots-service/bot.action-interface";
import { CactusBreedingService } from "@app/blockchain/contracts/cactus-breeding/cactus-breeding.service";

@Injectable()
export class OpenForBreedingAction implements BotActionInterface {
    type = "open-for-breeding";

    constructor(
        private readonly cactusBreedingService: CactusBreedingService,
    ) {}

    async canExecute(context: BotContext): Promise<boolean> {
        return context.cactiOpenFromBreeding < 2 && context.cactiCount > 0;
    }

    async getWeight(context: BotContext): Promise<number> {
        return 30;
    }

    async execute(context: BotContext) {
        Logger.log("Executing open for breeding action");
        // await this.cactusBreedingService.openForBreeding(chooseCactusToOpenForBreeding(context.walletAddress), context.walletAddress);
    }
}