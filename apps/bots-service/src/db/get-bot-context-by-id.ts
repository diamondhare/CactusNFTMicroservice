import { BotsDataEntity } from "@app/database/entities/bots-data-entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GetBotContextById {
    constructor(
        @InjectRepository(BotsDataEntity)
        private readonly repository: Repository<BotsDataEntity>
    ) {}

    async getOne(botId: string): Promise<BotsDataEntity> {
        const botContext = await this.repository.findOneBy({ id: botId });

        if (!botContext) {
            throw new NotFoundException(`Bot with ID ${botId} not found`);
        }

        return botContext;
    }
}