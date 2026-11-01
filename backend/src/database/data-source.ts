import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';
import { Medico } from '../modules/gestion/entities/medico.entity.js';
import { Reserva } from '../modules/gestion/entities/reserva.entity.js';
import { Usuario } from '../modules/gestion/entities/usuario.entity.js';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Usuario, Medico, Reserva],
    migrations: ['dist/database/migrations/*.js'],
    synchronize: false,
});

