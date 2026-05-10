import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/database';

import { CactusMintedEventRepository } from './gen1-cactus-minted.repository';
import { CactusMintedEventEntity } from '@app/database/entities/gen1-minted-cactus-event.entity';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CactusMintedEventEntity])],
  providers: [CactusMintedEventRepository],
  exports: [CactusMintedEventRepository],
})
export class EventRepositoriesModule {}
