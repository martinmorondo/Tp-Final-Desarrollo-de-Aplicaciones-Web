import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservasService } from './reservas.service.js';
import { Reserva } from './entities/reserva.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva])],
  providers: [ReservasService],
  exports: [ReservasService],
})
export class ReservasModule {}