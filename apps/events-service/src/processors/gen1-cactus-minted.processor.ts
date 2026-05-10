import { Injectable } from '@nestjs/common';

export type CactusMintedEventPayload = {
  contractAddress: string;
  transactionHash: string;
  cactusTokenId: bigint;
  owner: string;
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
      parentA: "0",
      parentB: "0",
      generation: 1,
      genome: payload.genome.toString(),
    };
  }
}
