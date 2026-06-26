import { BotsDataEntity } from "@app/database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GetBotSecretKey {
    constructor(
            @InjectRepository(BotsDataEntity)
            private readonly repository: Repository<BotsDataEntity>,
        ) {}
    async getOne(botId: string): Promise<string> {
        const bot = await this.repository.findOneBy({id: botId});
        if(!bot) {
            throw new Error(`Bot with id ${botId} not found`);
        }
        return bot.secretKey;
    }
}