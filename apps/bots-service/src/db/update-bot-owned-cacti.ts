import { balanceOf } from "@app/blockchain/contracts/cactus721/methods/balanceOf";
import { CONTRACT_ADDRESSES, type ContractAddresses } from "@app/blockchain";
import { BotsDataEntity } from "@app/database";
import { Inject, Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CACTUS_721_ABI } from "@app/blockchain/abis/cactus721.abi";
import { BotSignerProvider } from "@app/blockchain/providers/bot-signer.provider";

@Injectable()
export class UpdateBotOwnedCacti {
    private readonly logger = new Logger(UpdateBotOwnedCacti.name);
    constructor(
            @Inject(CONTRACT_ADDRESSES)
            private readonly contractAddresses: ContractAddresses,
            @InjectRepository(BotsDataEntity)
            private readonly repository: Repository<BotsDataEntity>,
            private readonly botSignerProvider: BotSignerProvider,
        ) {}
    
    async updateBalance(botId: string) {
        const bot = await this.repository.findOneBy({id: botId});
        if(!bot) {
            throw new Error(`Bot with id ${botId} not found`);
        }
        if(!this.contractAddresses.cactus721) {
            throw new Error(`Cactus721 address is not set`);
        }
        const botWalletInstance = await this.botSignerProvider.getSigner(bot.secretKey);
        const ownedCacti = await balanceOf(bot?.walletAddress, this.contractAddresses.cactus721, CACTUS_721_ABI, botWalletInstance);
        this.logger.log(`Updating bot ${bot.walletAddress} owned cacti to ${ownedCacti}`);
        bot.ownedCacti = ownedCacti;
        await this.repository.save(bot);
    }
}