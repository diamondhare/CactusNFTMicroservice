import { Inject, Injectable, Logger } from '@nestjs/common';
import { HARDHAT_PROVIDER } from '@app/blockchain';
import { JsonRpcProvider, Wallet } from 'ethers';

@Injectable()
export class BotSignerProvider {
  constructor(
    @Inject(HARDHAT_PROVIDER)
    private readonly provider: JsonRpcProvider,
  ) {}

  async getSigner(botSecretKey: string): Promise<Wallet> {
    Logger.log(`Bot secret key in getSigner: ${botSecretKey}`);
    const wallet = new Wallet(botSecretKey, this.provider);
    Logger.log(`Wallet created with address: ${await wallet.getAddress()}`);
    return wallet;
  }
}

