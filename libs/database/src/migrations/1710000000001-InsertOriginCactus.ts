import { MigrationInterface, QueryRunner } from 'typeorm';

const ORIGIN_CACTUS_TRANSACTION_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000';
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export class InsertOriginCactus1710000000001 implements MigrationInterface {
  name = 'InsertOriginCactus1710000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "cactus-nft-data" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "transactionHash" character varying(66) NOT NULL,
        "cactusTokenId" numeric(78,0) NOT NULL,
        "owner" character varying(42) NOT NULL,
        "parentA" numeric(78,0) NOT NULL,
        "parentB" numeric(78,0) NOT NULL,
        "generation" integer NOT NULL,
        "genome" numeric(78,0) NOT NULL,
        CONSTRAINT "PK_cactus_nft_data_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_cactus_nft_data_transaction_hash"
      ON "cactus-nft-data" ("transactionHash")
    `);
    await queryRunner.query(`
      INSERT INTO "cactus-nft-data" (
        "transactionHash",
        "cactusTokenId",
        "owner",
        "parentA",
        "parentB",
        "generation",
        "genome"
      )
      VALUES ($1, '0', $2, '0', '0', 0, '0')
      ON CONFLICT ("transactionHash") DO NOTHING
    `, [
      ORIGIN_CACTUS_TRANSACTION_HASH,
      process.env.GAME_MASTER_ADDRESS ?? ZERO_ADDRESS,
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "cactus-nft-data"
      WHERE "transactionHash" = $1
    `, [ORIGIN_CACTUS_TRANSACTION_HASH]);
  }
}
