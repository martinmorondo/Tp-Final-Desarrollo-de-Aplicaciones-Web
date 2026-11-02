import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicosService } from '../../core/medicos.service';
import { ReservasService } from '../../core/reservas.service';
import { Medico, Reserva } from '../../core/modelos';

interface Mensaje {
  tipo: 'ok' | 'error';
  texto: string;
}

function aTextoFecha(d: Date): string {
  const mes = String(d.getMonth() + 1).padStart(2, '0');
  const dia = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${mes}-${dia}`;
}

@Component({
  selector: 'app-paciente',
  imports: [FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './paciente.component.html',
  styleUrl: './paciente.component.css',
})
export class PacienteComponent implements OnInit {
  medicos = signal<Medico[]>([]);
  turnos = signal<Reserva[]>([]);
  mensaje = signal<Mensaje | null>(null);
  enviando = signal(false);

  // Campos del formulario
  medicoId: number | null = null;
  fecha = '';
  hora: number | null = null;
  horasLibres = signal<number[]>([]);
  cargandoHoras = signal(false);

  readonly fechaMin: string;
  readonly fechaMax: string;

  constructor(
    private medicosService: MedicosService,
    private reservasService: ReservasService,
  ) {
    const hoy = new Date();
    const limite = new Date();
    limite.setDate(limite.getDate() + 30);
    this.fechaMin = aTextoFecha(hoy);
    this.fechaMax = aTextoFecha(limite);
  }

  ngOnInit(): void {
    this.medicosService.listar('ACTIVO').subscribe({
      next: (m) => this.medicos.set(m),
      error: (e) => this.mostrarError(e),
    });
    this.cargarTurnos();
  }

  private cargarTurnos(): void {
    this.reservasService.listar().subscribe({
      next: (t) => this.turnos.set(t),
      error: (e) => this.mostrarError(e),
    });
  }

  cambiarMedico(id: number | null): void {
    this.medicoId = id;
    this.cargarDisponibilidad();
  }

  cambiarFecha(fecha: string): void {
    this.fecha = fecha;
    this.cargarDisponibilidad();
  }

  private cargarDisponibilidad(): void {
    this.hora = null;
    this.horasLibres.set([]);
    if (this.medicoId === null || !this.fecha) return;

    const medico = this.medicoId;
    const fecha = this.fecha;
    this.cargandoHoras.set(true);

    this.reservasService.disponibilidad(medico, fecha).subscribe({
      next: (d) => {
        // Ignora respuestas viejas si el usuario ya cambió de médico o fecha.
        if (medico !== this.medicoId || fecha !== this.fecha) return;
        this.cargandoHoras.set(false);
        this.horasLibres.set(d.horas_libres);
        this.hora = d.horas_libres.length > 0 ? d.horas_libres[0] : null;
      },
      error: (e) => {
        this.cargandoHoras.set(false);
        this.mostrarError(e);
      },
    });
  }

  reservar(): void {
    this.mensaje.set(null);

    if (this.medicoId === null || !this.fecha || this.hora === null) {
      this.mensaje.set({ tipo: 'error', texto: 'Elegí un médico, una fecha y un horario libre' });
      return;
    }

    const hh = String(this.hora).padStart(2, '0');
    this.enviando.set(true);

    this.reservasService
      .crear({ id_medico: this.medicoId, fecha_hora: `${this.fecha}T${hh}:00:00` })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.mensaje.set({ tipo: 'ok', texto: 'Turno reservado correctamente' });
          this.cargarTurnos();
          this.cargarDisponibilidad();
        },
        error: (e) => {
          this.enviando.set(false);
          this.mostrarError(e);
        },
      });
  }

  // Solo oculta el botón; la regla real la valida el backend.
  puedeCancelar(t: Reserva): boolean {
    if (t.estado !== 'ACTIVO') return false;
    const turno = new Date(t.fecha_hora);
    turno.setHours(0, 0, 0, 0);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    return turno > hoy;
  }

  cancelar(t: Reserva): void {
    if (!confirm('¿Querés cancelar este turno?')) return;
    this.mensaje.set(null);

    this.reservasService.cambiarEstado(t.id, 'CANCELADO').subscribe({
      next: () => {
        this.mensaje.set({ tipo: 'ok', texto: 'Turno cancelado' });
        this.cargarTurnos();
      },
      error: (e) => this.mostrarError(e),
    });
  }

  private mostrarError(e: any): void {
    const m = e?.error?.message;
    const texto = Array.isArray(m) ? m.join('. ') : m || 'No se pudo completar la operación';
    this.mensaje.set({ tipo: 'error', texto });
  }
}