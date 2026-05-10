import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CactusMintedEventEntity } from '@app/database/entities/gen1-minted-cactus-event.entity';
import { Repository } from 'typeorm';

import type { PersistableCactusMintedEvent } from '../processors/gen1-cactus-minted.processor';

@Injectable()
export class CactusMintedEventRepository {
  constructor(
    @InjectRepository(CactusMintedEventEntity)
    private readonly repository: Repository<CactusMintedEventEntity>,
  ) {}

  async saveOnce(event: PersistableCactusMintedEvent): Promise<void> {
    await this.repository.upsert(event, {
      conflictPaths: ['transactionHash', 'logIndex'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
