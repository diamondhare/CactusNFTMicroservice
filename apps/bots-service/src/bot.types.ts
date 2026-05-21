import { BotActions } from "./enums/bot-actions-enum";

export type BotContext = {
    cactiCount: number;
    lastAction: BotActions;
    cactiOpenFromBreeding: number;
    ethBalance: string;
    walletAddress: string;
    secretKey: string;
};