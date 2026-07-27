import { CactusNftDataEntity } from "@app/database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ILike, Repository } from "typeorm";

@Injectable()
export class GetValidCactusForTransfer {
    constructor(
        @InjectRepository(CactusNftDataEntity)
        private readonly repository: Repository<CactusNftDataEntity>,
    ) {}

    async getAll(botAddress: string): Promise<string[]> {
        const candidates = await this.repository.findBy({
            owner: ILike(botAddress),
            isOpenForBreeding: false,
        });
        if (candidates.length === 0) {
            throw new NotFoundException("No valid cacti with closed status found for address " + botAddress);
        }
        return candidates.map((cactus) => cactus.cactusTokenId);
    }

    async updateOwner(cactusTokenId: string, owner: string): Promise<void> {
        await this.repository.update({ cactusTokenId }, { owner });
    }
}