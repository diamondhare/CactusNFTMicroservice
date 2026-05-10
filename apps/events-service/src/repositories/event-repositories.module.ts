import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CactusNftDataEntity, DatabaseModule } from '@app/database';

import { CactusMintedEventRepository } from './gen1-cactus-minted.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CactusNftDataEntity])],
  providers: [CactusMintedEventRepository],
  exports: [CactusMintedEventRepository],
})
export class EventRepositoriesModule {}
