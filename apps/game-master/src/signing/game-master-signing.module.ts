import { Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';

import { GameMasterSignerService } from './game-master-signer.service';

@Module({
  imports: [BlockchainModule],
  providers: [GameMasterSignerService],
  exports: [GameMasterSignerService],
})
export class GameMasterSigningModule {}
