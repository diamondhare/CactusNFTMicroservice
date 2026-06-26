import { Injectable, Logger } from "@nestjs/common";
import { BotActionInterface } from "apps/bots-service/bot.action-interface";
import { BotsRedisService } from "@app/common/redis/bots/botsRedis.service";
import { BOT_MAX_IDLE_TIME, BOT_MIN_IDLE_TIME } from "../constants/bot.constants";
import { BotContext } from "apps/bots-service/types/bot-context.types";
import { BotActions } from "../enums/bot-actions-enum";

@Injectable()
export class SetBotIdle implements BotActionInterface {
    type = BotActions.Idle;

    constructor(
        private readonly botsRedisService: BotsRedisService
    ) {}

    async canExecute(context: BotContext): Promise<boolean> {
        return true;
    }

    async getWeight(context: BotContext): Promise<number> {
        return 75;
    }

    async execute(context: BotContext): Promise<string> {
        const randomIdleTime = Math.random() * (BOT_MAX_IDLE_TIME - BOT_MIN_IDLE_TIME) + BOT_MIN_IDLE_TIME;
        Logger.log(`--- bot idle until ${new Date(Date.now() + randomIdleTime).toLocaleString("ru-RU")} ---`);
        await this.botsRedisService.botSetIdleTime(context.botId, randomIdleTime)
        return "";
    }
}