import { MigrationInterface, QueryRunner } from "typeorm";

export class AddClientsTable1753883763521 implements MigrationInterface {
    name = 'AddClientsTable1753883763521'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."clients_state_enum" AS ENUM('CA', 'NY', 'NV', 'TX', 'FL')`);
        await queryRunner.query(`CREATE TABLE "clients" ("id" uuid NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "dateOfBirth" date NOT NULL, "creditScore" integer NOT NULL, "monthlyIncome" numeric(10,2) NOT NULL, "state" "public"."clients_state_enum" NOT NULL, CONSTRAINT "PK_f1ab7cf3a5714dbc6bb4e1c28a4" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "clients"`);
        await queryRunner.query(`DROP TYPE "public"."clients_state_enum"`);
    }

}
