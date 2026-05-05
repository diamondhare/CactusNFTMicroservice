import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from '@app/database';
import { SeedMintedEventEntity } from '@app/database/entities/seed-minted-event.entity';

import { SeedMintedEventRepository } from './seed-minted-event.repository';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([SeedMintedEventEntity])],
  providers: [SeedMintedEventRepository],
  exports: [SeedMintedEventRepository],
})
export class EventRepositoriesModule {}
