import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeReservaValorConsultaToInteger1761900000000
    implements MigrationInterface
{
    name = 'ChangeReservaValorConsultaToInteger1761900000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservas"
            ALTER COLUMN "valor_consulta"
            TYPE integer
            USING "valor_consulta"::integer
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservas"
            ALTER COLUMN "valor_consulta"
            TYPE numeric(10, 2)
            USING "valor_consulta"::numeric(10, 2)
        `);
    }
}