
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './database/entities/usuario.entity.js';
import { Medico } from './database/entities/medico.entity.js';
import { Reserva } from './database/entities/reserva.entity.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { GestionModule } from './modules/gestion/gestion.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Usuario, Medico, Reserva],
        autoLoadEntities: true,
        synchronize: true, 
      }),
    }),
    AuthModule,
    GestionModule,
  ],
})
export class AppModule {}