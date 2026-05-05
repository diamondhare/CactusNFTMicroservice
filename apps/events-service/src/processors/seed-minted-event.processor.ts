import { Injectable } from '@nestjs/common';

export type SeedMintedEventPayload = {
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
};

export type PersistableSeedMintedEvent = {
  contractAddress: string;
  transactionHash: string;
  logIndex: number;
  blockNumber: number;
  seedTokenId: string;
  owner: string;
  parentA: string;
  parentB: string;
  generation: number;
  genome: string;
  germinationChanceBps: string;
};

@Injectable()
export class SeedMintedEventProcessor {
  toPersistable(
    payload: SeedMintedEventPayload,
  ): PersistableSeedMintedEvent {
    return {
      contractAddress: payload.contractAddress,
      transactionHash: payload.transactionHash,
      logIndex: payload.logIndex,
      blockNumber: payload.blockNumber,
      seedTokenId: payload.seedTokenId.toString(),
      owner: payload.owner,
      parentA: payload.parentA.toString(),
      parentB: payload.parentB.toString(),
      generation: Number(payload.generation),
      genome: payload.genome.toString(),
      germinationChanceBps: payload.germinationChanceBps.toString(),
    };
  }
}
