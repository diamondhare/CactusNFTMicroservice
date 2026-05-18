import { Injectable } from "@nestjs/common";

export type BotContext = {
    cactiCount: number;
    lastAction: string;
    cactiOpenFromBreeding: number;
    ethBalance: number;
    walletAddress: string;
    secretKey: string;
};

@Injectable()
export class BotContextService {
    async getContext(botId: string): Promise<BotContext> {
        return {
            cactiCount: 10, 
            lastAction: "breed", 
            cactiOpenFromBreeding: 2,
            walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
            secretKey: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdefabcdef",
            ethBalance: 1
        };
    }
}