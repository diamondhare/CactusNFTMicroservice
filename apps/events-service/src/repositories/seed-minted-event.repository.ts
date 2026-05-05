import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SeedMintedEventEntity } from '@app/database/entities/seed-minted-event.entity';
import { Repository } from 'typeorm';

import type { PersistableSeedMintedEvent } from '../processors/seed-minted-event.processor';

@Injectable()
export class SeedMintedEventRepository {
  constructor(
    @InjectRepository(SeedMintedEventEntity)
    private readonly repository: Repository<SeedMintedEventEntity>,
  ) {}

  async saveOnce(event: PersistableSeedMintedEvent): Promise<void> {
    await this.repository.upsert(event, {
      conflictPaths: ['transactionHash', 'logIndex'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
