import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HARDHAT_PROVIDER } from '@app/blockchain';
import { JsonRpcProvider, Wallet } from 'ethers';

@Injectable()
export class GameMasterSignerService {
  private readonly wallet: Wallet;

  constructor(
    private readonly configService: ConfigService,
    @Inject(HARDHAT_PROVIDER)
    provider: JsonRpcProvider,
  ) {
    const privateKey = this.configService.getOrThrow<string>(
      'GAME_MASTER_PRIVATE_KEY',
    );

    this.wallet = new Wallet(privateKey, provider);
  }

  getSigner(): Wallet {
    return this.wallet;
  }

  getAddress(): string {
    return this.wallet.address;
  }
}
