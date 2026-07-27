import { Injectable } from "@nestjs/common";
import { BotContextService } from "../bots-service/src/bot.context";
import { BotActionSelector } from "./bot.selector";
import { WriteBotAction } from "./src/db/write-bot-action";
import { BotsActionHistoryPayload } from "./types/bot-action-entity";
import { BotsGateway } from "./src/bot.gateway";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BotActions } from "./src/enums/bot-actions-enum";

@Injectable()
export class BotEngine {
    
    constructor(
        private readonly contextService: BotContextService,
        private readonly botRepository: BotActionSelector,
        private readonly writeBotAction: WriteBotAction,
        private readonly botGateway: BotsGateway,
        private readonly botsRedisService: BotsRedisService,
    ) {}
    
    async tick(botId: string, jobId: string) {

        const context = await this.contextService.getContext(botId);
        const action = await this.botRepository.selectAction(context);

        if(!action) {
            this.botGateway.emitBotError(botId, `No action selected for bot ${botId}`);
            return
        }

        let txHash: string;
        this.botGateway.emitBotActionStarted(botId, action.type, jobId);
        try {
            txHash = await action.execute(context);
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            throw new Error(`Action ${action.type} failed: ${message}`, { cause: error });
        }

        const transactionHash = txHash || "N/A";
        const idleInfo = action.type === BotActions.Idle
            ? await this.botsRedisService.botCheckIfIdle(botId)
            : undefined;
        this.botGateway.emitBotTick(botId, action.type, transactionHash, jobId, idleInfo?.idleUntil);
        await this.writeBotAction.saveOnce({botId: context.botId, action: action.type, transactionHash, jobId} as BotsActionHistoryPayload)
    }
}