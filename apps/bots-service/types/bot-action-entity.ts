import { BotActions } from "../src/enums/bot-actions-enum";

export type BotsActionHistoryPayload = {
    botId: string;
    action: BotActions;
    transactionHash: string;
    jobId: string;
}