import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import {
  CONTRACT_ADDRESSES,
  HARDHAT_PROVIDER,
} from '@app/blockchain';
import type { ContractAddresses } from '@app/blockchain';
import { SEED_721_ABI } from '@app/blockchain/abis/seed721.abi';
import { ConfigService } from '@nestjs/config';
import {
  Contract,
  ContractEventPayload,
  EventLog,
  JsonRpcProvider,
} from 'ethers';

import { SeedMintedEventProcessor } from '../processors/seed-minted-event.processor';
import { SeedMintedEventRepository } from '../repositories/seed-minted-event.repository';

@Injectable()
export class SeedMintedListener implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedMintedListener.name);

  constructor(
    @Inject(HARDHAT_PROVIDER)
    private readonly provider: JsonRpcProvider,
    @Inject(CONTRACT_ADDRESSES)
    private readonly contractAddresses: ContractAddresses,
    private readonly configService: ConfigService,
    private readonly processor: SeedMintedEventProcessor,
    private readonly repository: SeedMintedEventRepository,
  ) {}

  async onApplicationBootstrap() {
    const seed721Address = this.contractAddresses.seed721;

    if (seed721Address === undefined) {
      this.logger.warn(
        'SEED_721_ADDRESS is not configured. SeedMinted listener is disabled.',
      );
      return;
    }

    const seed721 = new Contract(seed721Address, SEED_721_ABI, this.provider);
    const startBlock = Number(this.configService.get('EVENTS_START_BLOCK') ?? 0);

    await this.backfillSeedMintedEvents(seed721, seed721Address, startBlock);
    seed721.on(
      'SeedMinted',
      (
        tokenId: bigint,
        owner: string,
        parentA: bigint,
        parentB: bigint,
        generation: bigint,
        genome: bigint,
        germinationChanceBps: bigint,
        event: ContractEventPayload,
      ) => {
        void this.handleSeedMinted({
          contractAddress: seed721Address,
          transactionHash: event.log.transactionHash,
          logIndex: event.log.index,
          blockNumber: event.log.blockNumber,
          seedTokenId: tokenId,
          owner,
          parentA,
          parentB,
          generation,
          genome,
          germinationChanceBps,
        });
      },
    );

    this.logger.log(`Listening SeedMinted on ${seed721Address}`);
  }

  private async backfillSeedMintedEvents(
    seed721: Contract,
    seed721Address: string,
    startBlock: number,
  ) {
    const events = await seed721.queryFilter(
      'SeedMinted',
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
        parentA,
        parentB,
        generation,
        genome,
        germinationChanceBps,
      ] = event.args;

      await this.handleSeedMinted({
        contractAddress: seed721Address,
        transactionHash: event.transactionHash,
        logIndex: event.index,
        blockNumber: event.blockNumber,
        seedTokenId: tokenId as bigint,
        owner: owner as string,
        parentA: parentA as bigint,
        parentB: parentB as bigint,
        generation: generation as bigint,
        genome: genome as bigint,
        germinationChanceBps: germinationChanceBps as bigint,
      });
    }

    this.logger.log(
      `Backfilled ${events.length} SeedMinted events from block ${startBlock}`,
    );
  }

  private async handleSeedMinted(payload: {
    contractAddress: string;
    transactionHash: string;
    logIndex: number;
    blockNumber: number;
    seedTokenId: bigint;
    owner: string;
    parentA: bigint;
    parentB: bigint;
    generation: bigint;
    genome: bigint;
    germinationChanceBps: bigint;
  }) {
    try {
      const persistableEvent = this.processor.toPersistable(payload);

      await this.repository.saveOnce(persistableEvent);
      this.logger.log(
        `Saved SeedMinted seed=${persistableEvent.seedTokenId} tx=${persistableEvent.transactionHash}`,
      );
    } catch (error) {
      this.logger.error('Failed to process SeedMinted event', error);
    }
  }
}
