import { BotActions } from "../src/enums/bot-actions-enum";

export type BotContext = {
    botId: string;
    cactiCount: number;
    lastAction: BotActions;
    cactiOpenFromBreeding: number;
    ethBalance: string;
    walletAddress: string;
    secretKey: string;
};