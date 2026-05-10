import { DataSource } from 'typeorm';

import { SeedMintedEventEntity } from './entities/seed-minted-event.entity';
import { CreateSeedMintedEvents1710000000000 } from './migrations/1710000000000-CreateSeedMintedEvents';
import { InsertOriginCactus1710000000001 } from './migrations/1710000000001-InsertOriginCactus';
import { CactusNftDataEntity } from './entities/cactus-nft-data-entity';

export default new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: Number(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USER ?? 'cactus',
  password: process.env.DATABASE_PASSWORD ?? 'cactus',
  database: process.env.DATABASE_NAME ?? 'cactus_nft',
  entities: [SeedMintedEventEntity, CactusNftDataEntity],
  migrations: [
    CreateSeedMintedEvents1710000000000,
    InsertOriginCactus1710000000001,
  ],
  synchronize: false,
});
