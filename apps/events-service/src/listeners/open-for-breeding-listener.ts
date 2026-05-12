import { CONTRACT_ADDRESSES, HARDHAT_PROVIDER } from "@app/blockchain";
import type { ContractAddresses } from "@app/blockchain";
import { CACTUS_BREEDING_ABI } from "@app/blockchain/abis/cactus-breeding.abi";
import { Inject, Injectable, Logger, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Contract, ContractEventPayload, EventLog, JsonRpcProvider } from "ethers";
import { OpenForBreedingEventProcessor } from "../processors/open-for-breeding.processor";
import { OpenForBreedingEventRepository } from "../repositories/open-for-breeding.repository";

@Injectable()
export class OpenForBreedingListener implements OnApplicationBootstrap {
    private readonly logger = new Logger(OpenForBreedingListener.name);

    constructor(
        @Inject(HARDHAT_PROVIDER)
        private readonly provider: JsonRpcProvider,
        @Inject(CONTRACT_ADDRESSES)
        private readonly contractAddresses: ContractAddresses,
        private readonly configService: ConfigService,
        private readonly processor: OpenForBreedingEventProcessor,
        private readonly repository: OpenForBreedingEventRepository,
    ) {}

    async onApplicationBootstrap() {
        const cactusBreedingAddress = this.contractAddresses.cactusBreeding;

        if (cactusBreedingAddress === undefined) {
            this.logger.warn(
                'CACTUS_BREEDING_ADDRESS is not configured. OpenForBreeding listener is disabled.',
            );
            return;
        }

        const cactusBreeding = new Contract(cactusBreedingAddress, CACTUS_BREEDING_ABI, this.provider);
        const startBlock = Number(this.configService.get('EVENTS_START_BLOCK') ?? 0);

        await this.backfillOpenForBreedingEvents(cactusBreeding, cactusBreedingAddress, startBlock);
        cactusBreeding.on(
            'OpenForBreeding',
            (
                cactusTokenId: bigint,
                owner: string,
                event: ContractEventPayload,
            ) => {
                void this.handleOpenForBreeding({
                    contractAddress: cactusBreedingAddress,
                    transactionHash: event.log.transactionHash,
                    cactusTokenId,
                    owner,
                });
            },
        );
        this.logger.log('Listening OpenForBreeding on ${cactusBreedingAddress}');
    }

    private async backfillOpenForBreedingEvents(
        cactusBreeding: Contract,
        cactusBreedingAddress: string,
        startBlock: number,
    ) {
        const events = await cactusBreeding.queryFilter(
            'OpenForBreeding',
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
                genome,
              ] = event.args;
        
              await this.handleOpenForBreeding({
                contractAddress: cactusBreedingAddress,
                transactionHash: event.transactionHash,
                cactusTokenId: tokenId as bigint,
                owner: owner as string,
              });
            }
        
            this.logger.log(
              `Backfilled ${events.length} OpenForBreeding events from block ${startBlock}`,
            );
    }

    private async handleOpenForBreeding(payload: {
        contractAddress: string;
        transactionHash: string;
        cactusTokenId: bigint;
        owner: string;
    }) {
        try {
            this.logger.log(payload, 'Processing OpenForBreeding event');

            const persistableEvent = this.processor.toPersistable(payload);
            await this.repository.saveOnce(persistableEvent);
            this.logger.log(`Cactus ${persistableEvent.cactusTokenId} is now open for breeding`);
        } catch (error) {
            this.logger.error(`Failed to process OpenForBreeding event`, error);
        }
    }
}