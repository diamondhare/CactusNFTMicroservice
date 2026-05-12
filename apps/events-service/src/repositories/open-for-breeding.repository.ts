import { OpenForBreedingEntity } from '@app/database/entities/open-for-breeding-entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersistableOpenForBreedingEvent } from '../processors/open-for-breeding.processor';


@Injectable()
export class OpenForBreedingEventRepository {
  constructor(
    @InjectRepository(OpenForBreedingEntity)
    private readonly repository: Repository<OpenForBreedingEntity>,
  ) {}

  async saveOnce(event: PersistableOpenForBreedingEvent): Promise<void> {
    await this.repository.upsert(event, {
      conflictPaths: ['transactionHash'],
      skipUpdateIfNoValuesChanged: true,
    });
  }
}
