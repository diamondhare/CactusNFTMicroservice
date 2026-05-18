import {
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { BotsQueueService } from './src/bot-queue.service';


@Controller('bots')
export class BotsController {
  constructor(
    private readonly botsQueueService: BotsQueueService,
  ) {}

  @Post(':id/run')
  async runBot(
    @Param('id') botId: string,
  ) {
    return this.botsQueueService.enqueue(botId);
  }
}