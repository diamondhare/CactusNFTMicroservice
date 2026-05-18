import { Injectable } from '@nestjs/common';

export type ClosedForBreedingEventPayload = {
  transactionHash: string;
  cactusTokenId: bigint;
  owner: string;
};

export type PersistableClosedForBreedingEvent = {
  transactionHash: string;
  cactusTokenId: string;
  owner: string;
};

@Injectable()
export class ClosedForBreedingEventProcessor {
  toPersistable(
    payload: ClosedForBreedingEventPayload,
  ): PersistableClosedForBreedingEvent {
    return {
      transactionHash: payload.transactionHash,
      cactusTokenId: payload.cactusTokenId.toString(),
      owner: payload.owner,
    };
  }
}