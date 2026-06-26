import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CactusNftDataEntity, DatabaseModule } from '@app/database';

import { CactusMintedEventRepository } from './gen1-cactus-minted.repository';
import { TransferEventRepository } from './transfer.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CactusNftDataEntity])],
  providers: [CactusMintedEventRepository, TransferEventRepository],
  exports: [CactusMintedEventRepository, TransferEventRepository],
})
export class EventRepositoriesModule {}
