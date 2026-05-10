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
import { ConfigService } from '@nestjs/config';
import { Contract, EventLog, JsonRpcProvider } from 'ethers';

import { CactusMintedEventProcessor } from '../processors/gen1-cactus-minted.processor';
import { CactusMintedEventRepository } from '../repositories/gen1-cactus-minted.repository';
import { CACTUS_721_ABI } from '@app/blockchain/abis/cactus721.abi';

@Injectable()
export class Gen1CactusMintedListener implements OnApplicationBootstrap {
  private readonly logger = new Logger(Gen1CactusMintedListener.name);

  constructor(
    @Inject(HARDHAT_PROVIDER)
    private readonly provider: JsonRpcProvider,
    @Inject(CONTRACT_ADDRESSES)
    private readonly contractAddresses: ContractAddresses,
    private readonly configService: ConfigService,
    private readonly processor: CactusMintedEventProcessor,
    private readonly repository: CactusMintedEventRepository,
  ) {}

  async onApplicationBootstrap() {
    const cactus721Address = this.contractAddresses.cactus721;

    if (cactus721Address === undefined) {
      this.logger.warn(
        'CACTUS_721_ADDRESS is not configured. Gen1CactusMinted listener is disabled.',
      );
      return;
    }

    const cactus721 = new Contract(cactus721Address, CACTUS_721_ABI, this.provider);
    const startBlock = Number(this.configService.get('EVENTS_START_BLOCK') ?? 0);

    await this.backfillCactusMintedEvents(cactus721, cactus721Address, startBlock);
    cactus721.on(
      'Gen1CactusMinted',
      (
        tokenId: bigint,
        owner: string,
        parentA: bigint,
        parentB: bigint,
        generation: bigint,
        genome: bigint,
        event: EventLog,
      ) => {
        void this.handleCactusMinted({
          contractAddress: cactus721Address,
          transactionHash: event.transactionHash,
          cactusTokenId: tokenId,
          owner,
          parentA,
          parentB,
          generation,
          genome,
        });
      },
    );

    this.logger.log(`Listening Gen1CactusMinted on ${cactus721Address}`);
  }

  private async backfillCactusMintedEvents(
    cactus721: Contract,
    cactus721Address: string,
    startBlock: number,
  ) {
    const events = await cactus721.queryFilter(
      'Gen1CactusMinted',
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

      await this.handleCactusMinted({
        contractAddress: cactus721Address,
        transactionHash: event.transactionHash,
        cactusTokenId: tokenId as bigint,
        owner: owner as string,
        genome: genome as bigint,
      });
    }

    this.logger.log(
      `Backfilled ${events.length} SeedMinted events from block ${startBlock}`,
    );
  }

  private async handleCactusMinted(payload: {
    contractAddress: string;
    transactionHash: string;
    cactusTokenId: bigint;
    owner: string;
    genome: bigint;
  }) {
    try {
      this.logger.log(payload, 'Processing Gen1CactusMinted event');
      const persistableEvent = this.processor.toPersistable(payload);

      await this.repository.saveOnce(persistableEvent);
      this.logger.log(
        `Saved Gen1CactusMinted cactus=${persistableEvent.cactusTokenId} tx=${persistableEvent.transactionHash}`,
      );
    } catch (error) {
      this.logger.error('Failed to process Gen1CactusMinted event', error);
    }
  }
}
