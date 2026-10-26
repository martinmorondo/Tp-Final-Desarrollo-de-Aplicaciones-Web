
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module.js';
import { GestionModule } from './modules/gestion/gestion.module.js';
import { UsuariosModule } from './usuarios/usuarios.module.js';
import { MedicosModule } from './medicos/medicos.module.js';
import { ReservasModule } from './reservas/reservas.module.js';

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
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    AuthModule,
    GestionModule,
    UsuariosModule,
    MedicosModule,
    ReservasModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
