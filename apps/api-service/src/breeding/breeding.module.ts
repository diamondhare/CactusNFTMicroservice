import { BlockchainModule } from '@app/blockchain';
import { Module } from '@nestjs/common';

import { BreedingController } from './breeding.controller';
import { BreedingService } from './breeding.service';

@Module({
  imports: [BlockchainModule],
  controllers: [BreedingController],
  providers: [BreedingService],
})
export class BreedingModule {}
