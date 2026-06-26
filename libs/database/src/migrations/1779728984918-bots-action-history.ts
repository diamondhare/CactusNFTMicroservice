import { MigrationInterface, QueryRunner } from "typeorm";

export class BotsActionHistory1779728984918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "bots-action-history" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "botId" uuid NOT NULL,
                "action" character varying(42) NOT NULL,
                "transactionHash" character varying(66) NOT NULL,
                "jobId" character varying(60) NOT NULL,
                CONSTRAINT "PK_bots_action_history_id" PRIMARY KEY ("id")
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
