import { MigrationInterface, QueryRunner } from "typeorm";

export class BotsData1779121027046 implements MigrationInterface {
    name = "BotsData1779121027046";
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "bots-data" (
                "id" uuid NOT NULL DEFAULT gen_random_uuid(),
                "ownedCacti" integer NOT NULL,
                "cactiOpenForBreeding" integer NOT NULL,
                "walletAddress" character varying(42) NOT NULL,
                "secretKey" character varying(66) NOT NULL,
                "ethBalance" numeric(78,0) NOT NULL,
                CONSTRAINT "PK_bots_data_id" PRIMARY KEY ("id")
            )
        `);

        // for(let i = 1; i <= 3; i++) {
        //     const walletAddress = process.env[`BOT_ADDRESS_${i}`];
        //     const secretKey = process.env[`BOT_PRIVATE_KEY_${i}`];

        //     if(!walletAddress) continue;

        //     // const ethBalance = await this.balanceGetter.getBalance(walletAddress);
        //     const ethBalance = 0;
        //      await queryRunner.query(`INSERT INTO "bots-data" ("walletAddress", "secretKey", "ownedCacti", "cactiOpenForBreeding", "ethBalance")
        //     VALUES ($1, $2, $3, $5, $6)`, [walletAddress, secretKey, 0, 0, ethBalance]);
        // }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
