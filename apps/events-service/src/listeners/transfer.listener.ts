import { CONTRACT_ADDRESSES, HARDHAT_PROVIDER } from "@app/blockchain";
import type { ContractAddresses } from "@app/blockchain";
import { CACTUS_721_ABI } from "@app/blockchain/abis/cactus721.abi";
import { Inject, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Contract, ContractEventPayload, EventLog, JsonRpcProvider } from "ethers";
import { TransferEventProcessor } from "../processors/transfer.processor";
import { TransferEventRepository } from "../repositories/transfer.repository";


@Injectable()
export class TransferListener implements OnApplicationBootstrap {
    private readonly logger = new Logger(TransferListener.name);

    constructor(
        @Inject(HARDHAT_PROVIDER)
        private readonly provider: JsonRpcProvider,
        @Inject(CONTRACT_ADDRESSES)
        private readonly contractAddresses: ContractAddresses,
        private readonly configService: ConfigService,
        private readonly processor: TransferEventProcessor,
        private readonly repository: TransferEventRepository,
    ) {}

    async onApplicationBootstrap() {
        const cactusNftAddress = this.contractAddresses.cactus721;

        if (cactusNftAddress === undefined) {
            this.logger.warn(
                'CACTUS_721_ADDRESS is not configured. Transfer listener is disabled.',
            );
            return;
        }

        const cactusNft = new Contract(cactusNftAddress, CACTUS_721_ABI, this.provider);
        const startBlock = Number(this.configService.get('EVENTS_START_BLOCK') ?? 0);

        await this.backfillTransferEvents(cactusNft, cactusNftAddress, startBlock);
        cactusNft.on(
            'Transfer',
            (
                from: string,
                to: string,
                tokenId: bigint,
                event: ContractEventPayload,
            ) => {
                void this.handleTransfer({
                    contractAddress: cactusNftAddress,
                    transactionHash: event.log.transactionHash,
                    from,
                    to,
                    cactusTokenId: tokenId,
                });
            },
        );
        this.logger.log('Listening Transfer on ${cactusNftAddress}');
    }
    
    private async backfillTransferEvents(
        cactusNft: Contract,
        cactusNftAddress: string,
        startBlock: number,
    ) {
        const events = await cactusNft.queryFilter(
            'Transfer',
            startBlock,
            'latest',
        );

        for (const event of events) {
              if (!(event instanceof EventLog)) {
                continue;
            }

            const [from, to, tokenId] = event.args;

            await this.handleTransfer({
                contractAddress: cactusNftAddress,
                transactionHash: event.transactionHash,
                from,
                to,
                cactusTokenId: tokenId,
            });
        }
    }

    private async handleTransfer(payload: {
        contractAddress: string;
        transactionHash: string;
        from: string;
        to: string;
        cactusTokenId: bigint;
    }) {
        try {
            this.logger.log(payload, `Processing Transfer event`);
            const persistentEvent = await this.processor.toPresistable(payload);

            await this.repository.update(persistentEvent);
            this.logger.log(`CactusTokenId ${payload.cactusTokenId} transferred from ${payload.from} to ${payload.to}`);
        } catch (error) {
            this.logger.error(`Failed to process Transfer event`,error);
        }
    }
}