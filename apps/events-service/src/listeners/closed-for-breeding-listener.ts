import { CONTRACT_ADDRESSES, HARDHAT_PROVIDER } from "@app/blockchain";
import type { ContractAddresses } from "@app/blockchain";
import { CACTUS_BREEDING_ABI } from "@app/blockchain/abis/cactus-breeding.abi";
import { Inject, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Contract, ContractEventPayload, EventLog, JsonRpcProvider } from "ethers";
import { ClosedForBreedingEventProcessor } from "../processors/closed-for-breeding.processor";
import { ClosedForBreedingEventRepository } from "../repositories/closed-for-breeding.repository"; 
     
@Injectable()
export class ClosedForBreedingListener implements OnApplicationBootstrap {
    private readonly logger = new Logger(ClosedForBreedingListener.name);

    constructor(
        @Inject(HARDHAT_PROVIDER)
        private readonly provider: JsonRpcProvider,
        @Inject(CONTRACT_ADDRESSES)
        private readonly contractAddresses: ContractAddresses,
        private readonly configService: ConfigService,
        private readonly processor: ClosedForBreedingEventProcessor,
        private readonly repository: ClosedForBreedingEventRepository,
    ) {}

    async onApplicationBootstrap() {
        const cactusBreedingAddress = this.contractAddresses.cactusBreeding;

        if (cactusBreedingAddress === undefined) {
            this.logger.warn(
                'CACTUS_BREEDING_ADDRESS is not configured. ClosedForBreeding listener is disabled.',
            );
            return;
        }

        const cactusBreeding = new Contract(cactusBreedingAddress, CACTUS_BREEDING_ABI, this.provider);
        const startBlock = Number(this.configService.get('EVENTS_START_BLOCK') ?? 0);

        await this.backfillClosedForBreedingEvents(cactusBreeding, cactusBreedingAddress, startBlock);
        cactusBreeding.on(
            'ClosedForBreeding',
            (
                cactusTokenId: bigint,
                owner: string,
                event: ContractEventPayload,
            ) => {
                void this.handleClosedForBreeding({
                    contractAddress: cactusBreedingAddress,
                    transactionHash: event.log.transactionHash,
                    cactusTokenId,
                    owner,
                });
            },
        );
        this.logger.log('Listening ClosedForBreeding on ${cactusBreedingAddress}');
    }

    private async backfillClosedForBreedingEvents(
        cactusBreeding: Contract,
        cactusBreedingAddress: string,
        startBlock: number,
    ) {
        const events = await cactusBreeding.queryFilter(
            'ClosedForBreeding',
            startBlock,
            'latest',
        );

        for (const event of events) {
              if (!(event instanceof EventLog)) {
                continue;
              }
        
              const [
                tokenId,
                owner,
              ] = event.args;
        
              await this.handleClosedForBreeding({
                contractAddress: cactusBreedingAddress,
                transactionHash: event.transactionHash,
                cactusTokenId: tokenId as bigint,
                owner: owner as string,
              });
            }
        
            this.logger.log(
              `Backfilled ${events.length} ClosedForBreeding events from block ${startBlock}`,
            );
    }

    private async handleClosedForBreeding(payload: {
        contractAddress: string;
        transactionHash: string;
        cactusTokenId: bigint;
        owner: string;
    }) {
        try {
            this.logger.log(payload, 'Processing ClosedForBreeding event');

            const persistableEvent = this.processor.toPersistable(payload);
            await this.repository.remove(persistableEvent);
            this.logger.log(`Cactus ${persistableEvent.cactusTokenId} is now open for breeding`);
        } catch (error) {
            this.logger.error(`Failed to process OpenForBreeding event`, error);
        }
    }
}