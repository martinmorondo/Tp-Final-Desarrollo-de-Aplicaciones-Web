import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeMedicoMatriculaToVarchar1762000000000
    implements MigrationInterface
{
    name = 'ChangeMedicoMatriculaToVarchar1762000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "medicos"
            ALTER COLUMN "matricula"
            TYPE varchar(20)
            USING "matricula"::varchar(20)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    const matriculasNoNumericas = await queryRunner.query(`
        SELECT "matricula"
        FROM "medicos"
        WHERE "matricula" !~ '^[0-9]+$'
        LIMIT 1
    `);

    if (matriculasNoNumericas.length > 0) {
        throw new Error(
            'No se puede revertir la migración: existen matrículas alfanuméricas.',
        );
    }

    await queryRunner.query(`
        ALTER TABLE "medicos"
        ALTER COLUMN "matricula"
        TYPE integer
        USING "matricula"::integer
    `);
}
}