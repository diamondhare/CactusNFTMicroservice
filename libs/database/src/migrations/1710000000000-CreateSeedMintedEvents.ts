import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSeedMintedEvents1710000000000
  implements MigrationInterface
{
  name = 'CreateSeedMintedEvents1710000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto"');
    await queryRunner.query(`
      CREATE TABLE "seed_minted_events" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "contractAddress" character varying(42) NOT NULL,
        "transactionHash" character varying(66) NOT NULL,
        "logIndex" integer NOT NULL,
        "blockNumber" integer NOT NULL,
        "seedTokenId" numeric(78,0) NOT NULL,
        "owner" character varying(42) NOT NULL,
        "parentA" numeric(78,0) NOT NULL,
        "parentB" numeric(78,0) NOT NULL,
        "generation" integer NOT NULL,
        "genome" numeric(78,0) NOT NULL,
        "germinationChanceBps" numeric(78,0) NOT NULL,
        "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_seed_minted_events_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_seed_minted_events_tx_log" UNIQUE ("transactionHash", "logIndex")
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "seed_minted_events"');
  }
}
