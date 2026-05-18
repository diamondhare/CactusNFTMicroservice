import { Injectable } from "@nestjs/common";
import { BotContextService } from "./src/bot.context";
import { BotActionSelector } from "./bot.selector";
import { checkBotIdleTime } from "@app/common/redis/botIdleCheck/bot-idle-check";

@Injectable()
export class BotEngine {
    constructor(
        private readonly contextService: BotContextService,
        private readonly botRepository: BotActionSelector,
    ) {}
    
    async tick(botId: string) {

        if(await checkBotIdleTime(botId)) {
            return;
        }

        const context = await this.contextService.getContext(botId);

        const action = await this.botRepository.selectAction(context);

        if(!action) {
            return
        }

        await action.execute(context);
    }
}