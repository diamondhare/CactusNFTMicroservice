import { Injectable } from "@nestjs/common";
import { GetBotContextById } from "./db/get-bot-context-by-id";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BotContext } from "./bot.types";

@Injectable()
export class BotContextService {
    constructor(
        private readonly repository: GetBotContextById,
        private readonly botsRedisService: BotsRedisService
    ) {}
    async getContext(botId: string): Promise<BotContext> {
        const botContext = await this.repository.getOne(botId);
        const botLastAction = await this.botsRedisService.botGetStatus(botId);

        return {
            cactiCount: botContext.ownedCacti, 
            lastAction: botLastAction, 
            cactiOpenFromBreeding: botContext.cactiOpenForBreeding,
            walletAddress: botContext.walletAddress,
            secretKey: botContext.secretKey,
            ethBalance: botContext.ethBalance
        };
    }
}