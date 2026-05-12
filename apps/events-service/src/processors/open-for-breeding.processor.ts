import { Injectable } from '@nestjs/common';

export type OpenForBreedingEventPayload = {
  transactionHash: string;
  cactusTokenId: bigint;
  owner: string;
};

export type PersistableOpenForBreedingEvent = {
  transactionHash: string;
  cactusTokenId: string;
  owner: string;
};

@Injectable()
export class OpenForBreedingEventProcessor {
  toPersistable(
    payload: OpenForBreedingEventPayload,
  ): PersistableOpenForBreedingEvent {
    return {
      transactionHash: payload.transactionHash,
      cactusTokenId: payload.cactusTokenId.toString(),
      owner: payload.owner,
    };
  }
}
