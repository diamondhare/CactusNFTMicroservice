import { CactusNftDataEntity } from "@app/database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class GetValidCactusForBreedingOpen {
    constructor(
        @InjectRepository(CactusNftDataEntity)
        private readonly repository: Repository<CactusNftDataEntity>,
    ) {}

    async getOne(botAddress: string): Promise<string> {
        const allCactiClosedForBreeding = await this.repository.findBy({owner: botAddress, isOpenForBreeding: false});
        if (allCactiClosedForBreeding.length === 0) {
            throw new NotFoundException(`No valid cacti with closed status found for address ${botAddress}`);
        }
        const randomPosition = Math.floor(Math.random() * allCactiClosedForBreeding.length);
        return allCactiClosedForBreeding[randomPosition].cactusTokenId;
    }
}