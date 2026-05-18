import { Injectable, Logger } from "@nestjs/common";
import { BotContext } from "../bot.context";
import { BotActionInterface } from "apps/bots-service/bot.action-interface";
import { Cactus721Service } from "@app/blockchain/contracts/cactus721/cactus721.service";

@Injectable()
export class TransferAction implements BotActionInterface {
    type = "transfer";

    constructor(
        private readonly cactus721NFTService: Cactus721Service,
    ) {}

    async canExecute(context: BotContext): Promise<boolean> {
        return context.cactiOpenFromBreeding < 2 && context.cactiCount > 0;
    }

    async getWeight(context: BotContext): Promise<number> {
        return 30;
    }

    async execute(context: BotContext) {
        Logger.log("Executing transfer action");
        // const tokenIdToTransfer = chooseCactusToTransfer(context.walletAddress);
        // const chooseCactusRecieverAddress = "0x1234567890123456789012345678901234567890"; // TODO: choose a valid address
        // await this.cactus721NFTService.approve(chooseCactusRecieverAddress, tokenIdToTransfer, context.wallet);
        // await this.cactus721NFTService.transfer(tokenIdToTransfer, context.walletAddress);
    }
}