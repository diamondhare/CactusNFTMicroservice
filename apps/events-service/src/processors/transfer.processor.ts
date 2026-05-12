import { Injectable } from "@nestjs/common";

export type TransferEventPayload = {
  transactionHash: string;
  from: string;
  to: string;
  cactusTokenId: bigint;
};

export type PersistableTransferEvent = {
  transactionHash: string;
  from: string;
  to: string;
  cactusTokenId: string;
};

@Injectable()
export class TransferEventProcessor {
  toPresistable(
    payload: TransferEventPayload,
  ): PersistableTransferEvent {
    return {
      transactionHash: payload.transactionHash,
      from: payload.from,
      to: payload.to,
      cactusTokenId: payload.cactusTokenId.toString(),
    };
  }
}   