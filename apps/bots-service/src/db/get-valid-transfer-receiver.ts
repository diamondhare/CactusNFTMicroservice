import { BotsDataEntity, CactusNftDataEntity } from "@app/database";
import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Not, Repository } from "typeorm";

@Injectable()
export class GetValidTransferReceiver {
    constructor(
        @InjectRepository(BotsDataEntity)
        private readonly repository: Repository<BotsDataEntity>,
    ) {}

    async getOne(botId: string): Promise<{ botId: string; walletAddress: string }> {
        const allValidWalletAdresses = await this.repository.find({
            select: ['id', 'walletAddress'],
            where: { id: Not(botId) }
        });
        if (allValidWalletAdresses.length === 0) {
            throw new NotFoundException(`No valid wallets to transfer found for bot ${botId}`);
        }
        const randomPosition = Math.floor(Math.random() * allValidWalletAdresses.length);
        const receiver = allValidWalletAdresses[randomPosition];
        return { botId: receiver.id, walletAddress: receiver.walletAddress };
    }
}