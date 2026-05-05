import { Controller, Get } from '@nestjs/common';
import { GameMasterService } from './game-master.service';

@Controller()
export class GameMasterController {
  constructor(private readonly gameMasterService: GameMasterService) {}

  @Get()
  getHello(): string {
    return this.gameMasterService.getHello();
  }
}
