import { CONTRACT_ADDRESSES, type ContractAddresses } from '@app/blockchain';
import { CACTUS_BREEDING_ABI } from '@app/blockchain/abis/cactus-breeding.abi';
import { Inject, Injectable } from '@nestjs/common';
import type { Wallet } from 'ethers';

import type { BreedWithSignatureInput } from './cactus-breeding.types';
import { breedWithSignature } from './methods/breed-with-signature';
import { closeForBreeding } from './methods/close-for-breeding';
import { isOpenForBreeding } from './methods/is-open-for-breeding';
import { openForBreeding } from './methods/open-for-breeding';

@Injectable()
export class CactusBreedingService {
  constructor(
    @Inject(CONTRACT_ADDRESSES)
    private readonly contractAddresses: ContractAddresses,
  ) {}

  openForBreeding(tokenId: bigint, signer: Wallet): Promise<string> {
    return openForBreeding(
      tokenId,
      this.requireBreedingAddress(),
      CACTUS_BREEDING_ABI,
      signer,
    );
  }

  closeForBreeding(tokenId: bigint, signer: Wallet): Promise<string> {
    return closeForBreeding(
      tokenId,
      this.requireBreedingAddress(),
      CACTUS_BREEDING_ABI,
      signer,
    );
  }

  isOpenForBreeding(tokenId: bigint, signer: Wallet): Promise<boolean> {
    return isOpenForBreeding(
      tokenId,
      this.requireBreedingAddress(),
      CACTUS_BREEDING_ABI,
      signer,
    );
  }

  breedWithSignature(
    input: BreedWithSignatureInput,
    signer: Wallet,
  ): Promise<string> {
    return breedWithSignature(
      input,
      this.requireBreedingAddress(),
      CACTUS_BREEDING_ABI,
      signer,
    );
  }

  private requireBreedingAddress(): string {
    const address = this.contractAddresses.cactusBreeding;
    if (address === undefined) {
      throw new Error('CACTUS_BREEDING_ADDRESS is not configured');
    }
    return address;
  }
}
