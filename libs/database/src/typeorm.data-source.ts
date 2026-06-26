import { DataSource } from 'typeorm';

import { SeedMintedEventEntity } from './entities/seed-minted-event.entity';
import { CreateSeedMintedEvents1710000000000 } from './migrations/1710000000000-CreateSeedMintedEvents';
import { InsertOriginCactus1710000000001 } from './migrations/1710000000001-InsertOriginCactus';
import { CactusNftDataEntity } from './entities/cactus-nft-data-entity';
import { BotsDataEntity } from './entities/bots-data-entity';
import { BotsData1779121027046 } from './migrations/1779121027046-bots-data';
import { BotsActionHistoryEntity } from './entities/bots-action-history-entity';
import { BotsActionHistory1779728984918 } from './migrations/1779728984918-bots-action-history';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'cactus',
  password: process.env.DATABASE_PASSWORD ?? 'cactus',
  database: process.env.DATABASE_NAME ?? 'cactus_nft',
  entities: [SeedMintedEventEntity, CactusNftDataEntity, BotsDataEntity, BotsActionHistoryEntity],
  migrations: [
    CreateSeedMintedEvents1710000000000,
    InsertOriginCactus1710000000001,
    BotsData1779121027046,
    BotsActionHistory1779728984918,
  ],
  synchronize: false,
});
