import { Inject, Injectable } from '@nestjs/common';
import {
  CONTRACT_ADDRESSES,
  HARDHAT_PROVIDER,
} from '@app/blockchain';
import type { ContractAddresses } from '@app/blockchain';
import { SEED_721_ABI } from '@app/blockchain/abis/seed721.abi';
import { Contract, ContractTransactionResponse, JsonRpcProvider } from 'ethers';

import { BotWalletsService } from '../../wallets/bot-wallets.service';

export type OpenForBreedingInput = {
  tokenId: bigint;
  fromWalletIndex: number;
};

@Injectable()
export class OpenForBreedingStrategy {
  constructor(
    @Inject(HARDHAT_PROVIDER)
    private readonly provider: JsonRpcProvider,
    @Inject(CONTRACT_ADDRESSES)
    private readonly contractAddresses: ContractAddresses,
    private readonly botWalletsService: BotWalletsService,
  ) {}

  async openForBreeding(input: OpenForBreedingInput): Promise<string> {
    const seed721Address = this.contractAddresses.seed721;

    if (seed721Address === undefined) {
      throw new Error('SEED_721_ADDRESS is not configured');
    }

    const fromWallet = this.botWalletsService.getWallet(input.fromWalletIndex);
    const seed721 = new Contract(
      seed721Address,
      SEED_721_ABI,
      this.provider,
    ).connect(fromWallet);
    const openForBreeding = seed721.getFunction('openForBreeding');

    const tx = (await openForBreeding(
      input.tokenId,
    )) as ContractTransactionResponse;
    const receipt = await tx.wait();

    return receipt?.hash ?? tx.hash;
  }
}
