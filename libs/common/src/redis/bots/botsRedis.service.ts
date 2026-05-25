import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "../redis.service";
import { BotActions } from "apps/bots-service/src/enums/bot-actions-enum";
import { BotIdleInfo } from "./types/botIdleInfo.type";

@Injectable()
export class BotsRedisService {
    private readonly logger = new Logger(BotsRedisService.name);

    constructor(
        private readonly redis: RedisService,
    ) {}

    async botGetStatus(botId: string) {
        const botData = await this.redis.hgetall(`bot:${botId}`);
        if (!botData || Object.keys(botData).length === 0 || !botData.status) {
            this.logger.log(`Initializing bot ${botId} in Redis`);
            await this.redis.hset(`bot:${botId}`, {
                status: BotActions.Idle
            });
            return BotActions.Idle;
        }
        const status = Object.values(BotActions).find(v => v === botData.status)
        if(!status) {
            throw new Error(`Status ${botData.status} of bot ${botId} not found in status list`)
        }

        return status;
    }

    async botSetStatus(botId: string, status: BotActions) {
        if(status == BotActions.Idle) {
            throw new Error(`Can't set IDLE through botSetStatus`)
        }
        await this.redis.hset(`bot:${botId}`, {
            status: status
        });
    }

    async botCheckIfIdle(botId: string): Promise<BotIdleInfo>{
        const botData = await this.redis.hgetall(`bot:${botId}`);
        const botIdleInfo: BotIdleInfo = {
            idleUntil: parseInt(botData.idleUntil),
            isIdle: false
        }
        if (botData.idleUntil && Date.now() < parseInt(botData.idleUntil)) {
            botIdleInfo.isIdle = true;
            return botIdleInfo;
        }

        return botIdleInfo;
    }

    async botSetIdleTime(botId: string, idleTime: number) {
        await this.redis.hset(`bot:${botId}`, {
            idleUntil: Date.now() + idleTime,
            status: BotActions.Idle
        });
    }
}