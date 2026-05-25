import { Injectable } from "@nestjs/common";
import { BotContextService } from "../bots-service/src/bot.context";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BotActionSelector } from "./bot.selector";

@Injectable()
export class BotEngine {
    
    constructor(
        private readonly contextService: BotContextService,
        private readonly botRepository: BotActionSelector,
    ) {}
    
    async tick(botId: string) {

        const context = await this.contextService.getContext(botId);
        const action = await this.botRepository.selectAction(context);

        if(!action) {
            return
        }

        await action.execute(context);
    }
}