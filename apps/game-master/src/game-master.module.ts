import { Module } from '@nestjs/common';
import { GameMasterController } from './game-master.controller';
import { GameMasterService } from './game-master.service';

@Module({
  imports: [],
  controllers: [GameMasterController],
  providers: [GameMasterService],
})
export class GameMasterModule {}
