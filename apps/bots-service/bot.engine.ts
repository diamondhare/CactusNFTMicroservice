import { Injectable } from "@nestjs/common";
import { BotContextService } from "../bots-service/src/bot.context";
import { BotActionSelector } from "./bot.selector";
import { WriteBotAction } from "./src/db/write-bot-action";
import { BotsActionHistoryPayload } from "./types/bot-action-entity";

@Injectable()
export class BotEngine {
    
    constructor(
        private readonly contextService: BotContextService,
        private readonly botRepository: BotActionSelector,
        private readonly writeBotAction: WriteBotAction,
    ) {}
    
    async tick(botId: string, jobId: string) {

        const context = await this.contextService.getContext(botId);
        const action = await this.botRepository.selectAction(context);

        if(!action) {
            return
        }

        await action.execute(context);
        await this.writeBotAction.saveOnce({botId: context.botId, action: action.type, transactionHash:"mockTX", jobId: jobId} as BotsActionHistoryPayload)
    }
}