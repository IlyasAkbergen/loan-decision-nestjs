import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1753879202707 implements MigrationInterface {
    name = 'InitialSchema1753879202707'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "loans" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "client_id" uuid NOT NULL, "product_id" uuid NOT NULL, "sum" numeric(10,2) NOT NULL, "term_months" integer NOT NULL, "interest_rate" numeric(5,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5c6942c1e13e4de135c5203ee61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_LOAN_CLIENT_ID" ON "loans" ("client_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_LOAN_PRODUCT_ID" ON "loans" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(255) NOT NULL, "code" character varying(50) NOT NULL, "term_months" integer NOT NULL, "interest_rate" numeric(5,2) NOT NULL, "sum" numeric(15,2) NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_PRODUCTS_CODE" ON "products" ("code") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_PRODUCTS_CODE"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_LOAN_PRODUCT_ID"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_LOAN_CLIENT_ID"`);
        await queryRunner.query(`DROP TABLE "loans"`);
    }
}
