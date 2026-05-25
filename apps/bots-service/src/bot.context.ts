import { Injectable, Logger } from "@nestjs/common";
import { GetBotContextById } from "./db/get-bot-context-by-id";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BotContext } from "../types/bot-context.types";

@Injectable()
export class BotContextService {
    private readonly logger = new Logger("Tick logger");
    constructor(
        private readonly repository: GetBotContextById,
        private readonly botsRedisService: BotsRedisService
    ) {}
    async getContext(botId: string): Promise<BotContext> {
        const botContext = await this.repository.getOne(botId);
        this.logger.log(`Got bot context: ${JSON.stringify(botContext)}`)
        const botLastAction = await this.botsRedisService.botGetStatus(botId);
        this.logger.log(`Got bot last action: ${botLastAction}`)

        return {
            botId: botId,
            cactiCount: botContext.ownedCacti, 
            lastAction: botLastAction, 
            cactiOpenFromBreeding: botContext.cactiOpenForBreeding,
            walletAddress: botContext.walletAddress,
            secretKey: botContext.secretKey,
            ethBalance: botContext.ethBalance
        };
    }
}