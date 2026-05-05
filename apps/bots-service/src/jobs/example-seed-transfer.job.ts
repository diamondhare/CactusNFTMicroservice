import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SeedTransferStrategy } from '../strategies/seedTransfer/seed-transfer.strategy';


@Injectable()
export class ExampleSeedTransferJob implements OnApplicationBootstrap {
  private readonly logger = new Logger(ExampleSeedTransferJob.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly seedTransferStrategy: SeedTransferStrategy,
  ) {}

  async onApplicationBootstrap() {
    const enabled =
      this.configService.get<string>('BOT_EXAMPLE_TRANSFER_ENABLED') === 'true';

    if (!enabled) {
      this.logger.log('Example seed transfer job is disabled');
      return;
    }

    const tokenId = BigInt(
      this.configService.get<string>('BOT_EXAMPLE_TRANSFER_TOKEN_ID') ?? '0',
    );
    const fromWalletIndex = Number(
      this.configService.get<string>('BOT_EXAMPLE_TRANSFER_FROM_WALLET') ?? 0,
    );
    const toWalletIndex = Number(
      this.configService.get<string>('BOT_EXAMPLE_TRANSFER_TO_WALLET') ?? 1,
    );

    const txHash = await this.seedTransferStrategy.transferSeedToken({
      tokenId,
      fromWalletIndex,
      toWalletIndex,
    });

    this.logger.log(`Example seed transfer sent: ${txHash}`);
  }
}
