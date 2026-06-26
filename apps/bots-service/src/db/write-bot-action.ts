import { BotsActionHistoryEntity } from "@app/database/entities/bots-action-history-entity";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { BotsActionHistoryPayload } from "apps/bots-service/types/bot-action-entity";
import { Repository } from "typeorm";

@Injectable()
export class WriteBotAction {
    constructor(
        @InjectRepository(BotsActionHistoryEntity)
        private readonly repository: Repository<BotsActionHistoryEntity>,
    ) {}

    async saveOnce(payload: BotsActionHistoryPayload) {
        // await this.repository.upsert(payload, {
        //     conflictPaths: ['jobId'],
        // });
        //TODO: update and make jobID unique
        await this.repository.insert(payload);
    }
}