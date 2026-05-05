import { Module } from '@nestjs/common';
import { BlockchainModule } from '@app/blockchain';
import { CommonModule } from '@app/common';
import { DatabaseModule } from '@app/database';

import { ApiHealthController } from './health/api-health.controller';
import { BreedingModule } from './breeding/breeding.module';
import { CactusesModule } from './cactuses/cactuses.module';
import { SeedsModule } from './seeds/seeds.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    BlockchainModule,
    CactusesModule,
    SeedsModule,
    BreedingModule,
    UsersModule,
  ],
  controllers: [ApiHealthController],
})
export class ApiServiceModule {}
