import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicosService } from './medicos.service.js';
import { Medico } from './entities/medico.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Medico])],
  providers: [MedicosService],
  exports: [MedicosService],
})
export class MedicosModule {}