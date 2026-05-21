import { Injectable } from "@nestjs/common";
import { RedisService } from "../redis.service";
import { BotActions } from "apps/bots-service/src/enums/bot-actions-enum";

@Injectable()
export class BotsRedisService {
    constructor(
        private readonly redis: RedisService,
    ) {}

    async botGetStatus(botId: string) {
        const botData = await this.redis.hgetall(`bot:${botId}`);
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

    async botCheckIfIdle(botId: string) {
        const botData = await this.redis.hgetall(`bot:${botId}`);
        if (botData.idleUntil && Date.now() < parseInt(botData.idleUntil)) {
            return true;
        }

        return false;
    }

    async botSetIdleTime(botId: string, idleTime: number) {
        await this.redis.hset(`bot:${botId}`, {
            idleUntil: Date.now() + idleTime,
            status: BotActions.Idle
        });
    }
}