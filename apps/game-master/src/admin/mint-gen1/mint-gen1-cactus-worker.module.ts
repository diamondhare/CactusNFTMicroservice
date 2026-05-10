import { Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';
import { MintGen1QueueModule } from '@app/queue';

import { GameMasterSigningModule } from '../../signing/game-master-signing.module';
import { CactusAdminService } from './mint-gen1-cactus.service';
import { MintGen1CactusProcessor } from './mint-gen1-cactus.processor';

@Module({
  imports: [BlockchainModule, GameMasterSigningModule, MintGen1QueueModule],
  providers: [CactusAdminService, MintGen1CactusProcessor],
})
export class MintGen1CactusWorkerModule {}
