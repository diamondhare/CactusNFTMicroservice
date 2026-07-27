import { BotsDataEntity } from "@app/database";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CkeckIfAddressABot {
    constructor(
            @InjectRepository(BotsDataEntity)
            private readonly repository: Repository<BotsDataEntity>,
        ) {}

    async getOne(botAddress: string): Promise<boolean> {
        const bot = await this.repository.findOneBy({walletAddress: botAddress});
        if(!bot) {
            return false;
        } else {
            return true;
        }
    }
}