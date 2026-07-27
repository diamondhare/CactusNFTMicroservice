import { Inject, Injectable, Logger } from '@nestjs/common';
import { CONTRACT_ADDRESSES } from '@app/blockchain';
import type { ContractAddresses } from '@app/blockchain';
import { CACTUS_721_ABI } from '@app/blockchain/abis/cactus721.abi';
import type { MintGen1CactusJob } from '@app/queue';
import { Contract, ContractTransactionResponse } from 'ethers';

import { GameMasterSignerService } from '../../signing/game-master-signer.service';

@Injectable()
export class CactusAdminService {
  private readonly logger = new Logger('CactusAdminService');
  constructor(
    @Inject(CONTRACT_ADDRESSES)
    private readonly contractAddresses: ContractAddresses,
    private readonly gameMasterSignerService: GameMasterSignerService,
  ) {}

  async mintGen1Cactus(job: MintGen1CactusJob): Promise<string> {
    const cactus721Address = this.contractAddresses.cactus721;
    this.logger.log(
      `Minting Gen1 Cactus for ${job.to} with genome ${job.genome} using contract at ${cactus721Address}`,
    );
    if (cactus721Address === undefined) {
      throw new Error('CACTUS_721_ADDRESS is not configured');
    }

    if (job.genome === undefined) {
      throw new Error('Mint Gen1 job does not contain a resolved genome');
    }

    const signer = this.gameMasterSignerService.getSigner();
    const cactus721 = new Contract(cactus721Address, CACTUS_721_ABI, signer);
    const mintGen1Cactus = cactus721.getFunction('mintGen1Cactus');
    const tx = (await mintGen1Cactus(
      job.to,
      BigInt(job.genome),
    )) as ContractTransactionResponse;
    const receipt = await tx.wait();

    return receipt?.hash ?? tx.hash;
  }
}
