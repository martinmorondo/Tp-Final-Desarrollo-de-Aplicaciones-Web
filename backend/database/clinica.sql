-- =====================================================================
-- Base de datos de la clinica: esquema (segun el modelo de datos de la
-- consigna) + testeos.
--
-- -- Como usarlo:
--   1) Crear una base vacia (por ejemplo "clinica") y poner su nombre en DB_NAME del .env.
--   2) Ejecutar este archivo sobre esa base:
--        - pgAdmin: clic derecho en la base > Query Tool > abrir archivo > ejecutar (F5)
--        - o por consola: psql -U <usuario> -d <base> -f database/clinica.sql
--
-- Todos los usuarios de prueba tienen la clave: 1234
-- =====================================================================

DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS medicos CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TYPE IF EXISTS estados_reservas;
DROP TYPE IF EXISTS roles_usuarios;
DROP TYPE IF EXISTS estados_usuarios;

-- 
-- Enums del modelo
-- 
CREATE TYPE estados_usuarios AS ENUM ('ACTIVO', 'BAJA');
CREATE TYPE roles_usuarios   AS ENUM ('MEDICO', 'PACIENTE', 'ADMINISTRADOR');
CREATE TYPE estados_reservas AS ENUM ('ACTIVO', 'ATENDIDO', 'AUSENTE', 'CANCELADO');

-- 
-- Tablas
-- 
CREATE TABLE usuarios (
  id        SERIAL PRIMARY KEY,
  documento TEXT NOT NULL UNIQUE,
  apellidos TEXT NOT NULL,
  nombres   TEXT NOT NULL,
  email     TEXT NOT NULL,
  clave     TEXT NOT NULL,
  estado    estados_usuarios NOT NULL DEFAULT 'ACTIVO',
  rol       roles_usuarios   NOT NULL
);

CREATE TABLE medicos (
  id             SERIAL PRIMARY KEY,
  id_usuario     INTEGER NOT NULL UNIQUE REFERENCES usuarios (id) ON DELETE CASCADE,
  matricula      INTEGER NOT NULL,
  valor_consulta INTEGER NOT NULL
);

CREATE TABLE reservas (
  id             SERIAL PRIMARY KEY,
  id_medico      INTEGER NOT NULL REFERENCES medicos (id),
  id_paciente    INTEGER NOT NULL REFERENCES usuarios (id),
  fecha_hora     TIMESTAMP NOT NULL,
  estado         estados_reservas NOT NULL DEFAULT 'ACTIVO',
  valor_consulta INTEGER NOT NULL
);

-- 
-- Datos de prueba
-- 
INSERT INTO usuarios (id, documento, apellidos, nombres, email, clave, estado, rol) VALUES
  (1, '20000001', 'Gomez', 'Ana', 'admin@test.com', '$2b$10$zn/x4m4gwqo2QR2kxDvV7OOuQEGmWjqVsk6ANdyQvCSVtdN7bdOdi', 'ACTIVO', 'ADMINISTRADOR'),
  (2, '20000002', 'Federico', 'Carlos', 'medico@test.com', '$2b$10$LrPAenDFG0tEW9adAGF4Cel5hYiER03pMAlpvIK9wVUFK202WeQZK', 'ACTIVO', 'MEDICO'),
  (3, '20000003', 'Yampara', 'Laura', 'medico2@test.com', '$2b$10$habYbtHjXgf3UH0mVgDmJez24j5yPPxJa0h6oOa4qiZtAU0SChiP.', 'ACTIVO', 'MEDICO'),
  (4, '30000001', 'Perez', 'Paula', 'paciente@test.com', '$2b$10$/3b60MKyWVEb1Dfr64pvqeHmNsawc1kZhmuNrA/rZ/QJa4QkIc.Rm', 'ACTIVO', 'PACIENTE'),
  (5, '30000002', 'Diaz', 'Pedro', 'paciente2@test.com', '$2b$10$K6JBFTeC.EnJNkqOO/YM8.qaeHc4k0zRsFWbW9XMIYdQyQ9wzzywm', 'ACTIVO', 'PACIENTE'),
  (6, '30000003', 'Fernandez', 'Lucia', 'paciente3@test.com', '$2b$10$aLWwajlkqyGlRJDkgsxdZuFLN2ByMzEnr.ODwf2fJWAt16o65BtU.', 'ACTIVO', 'PACIENTE'),
  (7, '30000004', 'Baja', 'Bruno', 'baja@test.com', '$2b$10$uKKRAZga7ErN.sSk2FuvQu63gwNhVqSbUtYR.rjOTt0wzTogNUvva', 'BAJA', 'PACIENTE');

INSERT INTO medicos (id, id_usuario, matricula, valor_consulta) VALUES
  (1, 2, 12345, 15000),
  (2, 3, 67890, 18000);

-- Las fechas son relativas a "hoy" para que los datos siempre sirvan de ejemplo.
INSERT INTO reservas (id, id_medico, id_paciente, fecha_hora, estado, valor_consulta) VALUES
  (1, 1, 4, (CURRENT_DATE + 3) + TIME '10:00', 'ACTIVO',   15000),
  (2, 1, 5, (CURRENT_DATE + 3) + TIME '11:00', 'ACTIVO',   15000),
  (3, 2, 4, (CURRENT_DATE - 5) + TIME '09:00', 'ATENDIDO', 18000),
  (4, 1, 5, (CURRENT_DATE - 1) + TIME '09:00', 'ACTIVO',   15000),
  (5, 1, 6, (CURRENT_DATE - 1) + TIME '10:00', 'ACTIVO',   15000);

-- Como se insertaron ids fijos, se ajustan las secuencias para que los
-- proximos registros no choquen con ellos.
SELECT setval(pg_get_serial_sequence('usuarios', 'id'), (SELECT MAX(id) FROM usuarios));
SELECT setval(pg_get_serial_sequence('medicos',  'id'), (SELECT MAX(id) FROM medicos));
SELECT setval(pg_get_serial_sequence('reservas', 'id'), (SELECT MAX(id) FROM reservas));
