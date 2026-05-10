import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { PersistableCactusMintedEvent } from '../processors/gen1-cactus-minted.processor';
import { CactusNftDataEntity } from '@app/database/entities/cactus-nft-data-entity';

@Injectable()
export class CactusMintedEventRepository {
  constructor(
    @InjectRepository(CactusNftDataEntity)
    private readonly repository: Repository<CactusNftDataEntity>,
  ) {}

  async saveOnce(event: PersistableCactusMintedEvent): Promise<void> {
    await this.repository.upsert(event, {
      conflictPaths: ['transactionHash'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
