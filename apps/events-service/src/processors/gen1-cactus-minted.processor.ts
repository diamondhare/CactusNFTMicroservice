import { Injectable } from '@nestjs/common';

export type CactusMintedEventPayload = {
  contractAddress: string;
  transactionHash: string;
  cactusTokenId: bigint;
  owner: string;
  parentA: bigint;
  parentB: bigint;
  generation: bigint;
  genome: bigint;
};

export type PersistableCactusMintedEvent = {
  contractAddress: string;
  transactionHash: string;
  cactusTokenId: string;
  owner: string;
  parentA: string;
  parentB: string;
  generation: number;
  genome: string;
};

@Injectable()
export class CactusMintedEventProcessor {
  toPersistable(
    payload: CactusMintedEventPayload,
  ): PersistableCactusMintedEvent {
    return {
      contractAddress: payload.contractAddress,
      transactionHash: payload.transactionHash,
      cactusTokenId: payload.cactusTokenId.toString(),
      owner: payload.owner,
      parentA: payload.parentA.toString(),
      parentB: payload.parentB.toString(),
      generation: Number(payload.generation),
      genome: payload.genome.toString(),
    };
  }
}
