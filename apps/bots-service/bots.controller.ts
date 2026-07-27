import { Controller, Get, Param, Post } from '@nestjs/common';
import { BotsQueueService } from './src/bot-queue.service';
import { GetAllBots } from './src/db/get-all-bots';
import { CkeckIfAddressABot } from './src/db/check-if-address-a-bot';
import { BotUpdateTypes } from './src/enums/bot-updates-enum';
import { BotsUpdateService } from './src/bot-update.service';
import { UpdateBotOwnedCacti } from './src/db/update-bot-owned-cacti';
import { BotsRedisService } from '@app/common/redis/bots/botsRedis.service';
import { BotsGateway } from './src/bot.gateway';
import { GetRecentBotActions } from './src/db/get-recent-bot-actions';

@Controller('bots')
export class BotsController {
  constructor(
    private readonly botsQueueService: BotsQueueService,
    private readonly checkIfAddressABot: CkeckIfAddressABot,
    private readonly updateBotOwnedCacti: UpdateBotOwnedCacti,
    private readonly botsUpdateService: BotsUpdateService,
    private readonly getAllBots: GetAllBots,
    private readonly botsRedisService: BotsRedisService,
    private readonly botsGateway: BotsGateway,
    private readonly getRecentBotActions: GetRecentBotActions,
  ) {}

  @Get('activity/recent')
  getRecentActivity() {
    return this.getRecentBotActions.getRecent();
  }

  @Post(':id/run')
  async runBot(@Param('id') botId: string) {
    await this.botsRedisService.botSetRunning(botId, true);
    await this.updateBotOwnedCacti.updateBalance(botId);
    const jobId = await this.botsQueueService.enqueue(botId);
    this.botsGateway.emitBotRuntime(botId, true);
    return { botId, running: true, jobId };
  }

  @Post(':id/stop')
  async stopBot(@Param('id') botId: string) {
    await this.botsRedisService.botSetRunning(botId, false);
    const message = await this.botsQueueService.dequeue(botId);
    this.botsGateway.emitBotRuntime(botId, false);
    return { botId, running: false, message };
  }

  @Get(':id/runtime')
  async getBotRuntime(@Param('id') botId: string) {
    const [running, action, idleInfo] = await Promise.all([
      this.botsRedisService.botIsRunning(botId),
      this.botsRedisService.botGetStatus(botId),
      this.botsRedisService.botCheckIfIdle(botId),
    ]);
    return {
      botId,
      running,
      action,
      idleUntil: idleInfo.isIdle ? idleInfo.idleUntil : undefined,
    };
  }

  @Post(':address/increment-owned-cacti')
  async incrementOwnedCacti(@Param('address') botAddress: string) {
    return this.botsUpdateService.enqueueBotUpdate(
      botAddress,
      BotUpdateTypes.IncrementOwnedCacti,
    );
  }

  @Post(':address/decrement-owned-cacti')
  async decrementOwnedCacti(@Param('address') botAddress: string) {
    return this.botsUpdateService.enqueueBotUpdate(
      botAddress,
      BotUpdateTypes.DecrementOwnedCacti,
    );
  }

  @Get(':address/status')
  async getBotStatus(@Param('address') botAddress: string) {
    return this.checkIfAddressABot.getOne(botAddress);
  }

  @Get('all')
  async getBotsIds() {
    return this.getAllBots.getAll();
  }
}
