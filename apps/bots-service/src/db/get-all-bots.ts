import { BotsDataEntity } from "@app/database/entities/bots-data-entity";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GetAllBots {
    constructor(
        @InjectRepository(BotsDataEntity)
        private readonly repository: Repository<BotsDataEntity>
    ) {}

    async getAll(): Promise<string[]> {
        const botsIds = await this.repository.find({
            select: {
                id: true,
            },
        });

        if (botsIds.length === 0) {
            throw new NotFoundException(`No bots found`);
        }

        return botsIds.map((bot) => bot.id);
    }
}