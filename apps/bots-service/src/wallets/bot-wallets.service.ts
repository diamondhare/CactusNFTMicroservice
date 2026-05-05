import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HARDHAT_PROVIDER } from '@app/blockchain';
import { JsonRpcProvider, Wallet } from 'ethers';

@Injectable()
export class BotWalletsService {
  private readonly wallets: Wallet[];

  constructor(
    private readonly configService: ConfigService,
    @Inject(HARDHAT_PROVIDER)
    provider: JsonRpcProvider,
  ) {
    this.wallets = [
      this.configService.get<string>('BOT_PRIVATE_KEY_1'),
      this.configService.get<string>('BOT_PRIVATE_KEY_2'),
      this.configService.get<string>('BOT_PRIVATE_KEY_3'),
    ]
      .filter((privateKey): privateKey is string => Boolean(privateKey))
      .map((privateKey) => new Wallet(privateKey, provider));
  }

  getWallet(index: number): Wallet {
    const wallet = this.wallets[index];

    if (wallet === undefined) {
      throw new Error(`Bot wallet with index ${index} is not configured`);
    }

    return wallet;
  }

  getAddresses(): string[] {
    return this.wallets.map((wallet) => wallet.address);
  }
}
