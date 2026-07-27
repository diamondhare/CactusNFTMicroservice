import { Injectable, Logger } from '@nestjs/common';
import { BotActionInterface } from 'apps/bots-service/bot.action-interface';
import { CactusBreedingService } from '@app/blockchain/contracts/cactus-breeding/cactus-breeding.service';
import { BotsRedisService } from '@app/common/redis/bots/botsRedis.service';
import { BotActions } from '../enums/bot-actions-enum';
import { BotContext } from 'apps/bots-service/types/bot-context.types';
import { GetValidCactusForBreedingClose } from '../db/get-valid-cactus-for-breeding-close';
import { BotSignerProvider } from '@app/blockchain/providers/bot-signer.provider';

@Injectable()
export class CloseForBreedingAction implements BotActionInterface {
  type = BotActions.CloseForBreeding;

  constructor(
    private readonly cactusBreedingService: CactusBreedingService,
    private readonly getValidCactusForBreedingClose: GetValidCactusForBreedingClose,
    private readonly botsRedisService: BotsRedisService,
    private readonly botSignerProvider: BotSignerProvider,
  ) {}

  canExecute(context: BotContext): Promise<boolean> {
    return Promise.resolve(
      context.cactiOpenFromBreeding > 0 && context.cactiCount > 0,
    );
  }

  getWeight(): Promise<number> {
    return Promise.resolve(30);
  }

  async execute(context: BotContext): Promise<string> {
    Logger.log('Executing close for breeding action');
    await this.botsRedisService.botSetStatus(context.botId, this.type);
    const signer = await this.botSignerProvider.getSigner(context.secretKey);
    const tx = await this.cactusBreedingService.closeForBreeding(
      BigInt(
        await this.getValidCactusForBreedingClose.getOne(context.walletAddress),
      ),
      signer,
    );
    return tx;
  }
}
