import { DatabaseModule, CactusNftDataEntity } from '@app/database';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CactusesController } from './cactuses.controller';
import { CactusesService } from './cactuses.service';

@Module({
  imports: [DatabaseModule, TypeOrmModule.forFeature([CactusNftDataEntity])],
  controllers: [CactusesController],
  providers: [CactusesService],
})
export class CactusesModule {}
