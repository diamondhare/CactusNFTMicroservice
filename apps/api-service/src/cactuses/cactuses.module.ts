import { Module } from '@nestjs/common';

import { CactusesController } from './cactuses.controller';
import { CactusesService } from './cactuses.service';

@Module({
  controllers: [CactusesController],
  providers: [CactusesService],
})
export class CactusesModule {}
