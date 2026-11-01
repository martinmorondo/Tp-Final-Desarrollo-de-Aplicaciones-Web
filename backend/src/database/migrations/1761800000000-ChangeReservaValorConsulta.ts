
import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeReservaValorConsulta1761800000000
    implements MigrationInterface
{
    name = 'ChangeReservaValorConsulta1761800000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservas"
            ALTER COLUMN "valor_consulta"
            TYPE numeric(10, 2)
            USING "valor_consulta"::numeric(10, 2)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "reservas"
            ALTER COLUMN "valor_consulta"
            TYPE integer
            USING ROUND("valor_consulta")::integer
        `);
    }
}
