import { OpenForBreedingEntity } from '@app/database/entities/open-for-breeding-entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PersistableClosedForBreedingEvent } from '../processors/closed-for-breeding.processor';


@Injectable()
export class ClosedForBreedingEventRepository {
  constructor(
    @InjectRepository(OpenForBreedingEntity)
    private readonly repository: Repository<OpenForBreedingEntity>,
  ) {}

  async remove(event: PersistableClosedForBreedingEvent): Promise<void> {
    await this.repository.delete({cactusTokenId: event.cactusTokenId});
  }
}
