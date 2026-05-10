import { Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';
import { CommonModule } from '@app/common';
import { GameMasterController } from './game-master.controller';
import { GameMasterService } from './game-master.service';
import { MintGen1CactusWorkerModule } from './admin/mint-gen1/mint-gen1-cactus-worker.module';
import { GameMasterSigningModule } from './signing/game-master-signing.module';
import { MintGen1CactusModule } from './admin/mint-gen1/mint-gen1-cactus.module';
import { CactusAdminService } from './admin/mint-gen1/mint-gen1-cactus.service';

@Module({
  imports: [
    CommonModule,
    BlockchainModule,
    GameMasterSigningModule,
    MintGen1CactusWorkerModule,
    MintGen1CactusModule
  ],
  controllers: [GameMasterController],
  providers: [GameMasterService, CactusAdminService],
})
export class GameMasterModule {}
