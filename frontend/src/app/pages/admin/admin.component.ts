import { Component, OnInit, computed, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MedicosService } from '../../core/medicos.service';
import { PacientesService } from '../../core/pacientes.service';
import { ReservasService } from '../../core/reservas.service';
import { Medico, PacienteResumen, Reserva } from '../../core/modelos';

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
  selector: 'app-admin',
  imports: [FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent implements OnInit {
  medicos = signal<Medico[]>([]);
  medicosActivos = computed(() => this.medicos().filter((m) => m.estado === 'ACTIVO'));
  pacientes = signal<PacienteResumen[]>([]);
  turnos = signal<Reserva[]>([]);
  mensaje = signal<Mensaje | null>(null);
  enviando = signal(false);

  // Formulario de reserva
  pacienteId: number | null = null;
  medicoId: number | null = null;
  fecha = '';
  hora = 8;

  // Valores editables de la consulta, por id de médico
  valores: Record<number, number> = {};

  readonly horas = [8, 9, 10, 11, 12, 13, 14, 15];
  readonly fechaMin: string;
  readonly fechaMax: string;

  constructor(
    private medicosService: MedicosService,
    private pacientesService: PacientesService,
    private reservasService: ReservasService,
  ) {
    const limite = new Date();
    limite.setDate(limite.getDate() + 30);
    this.fechaMin = aTextoFecha(new Date());
    this.fechaMax = aTextoFecha(limite);
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.cargarTurnos();
    this.pacientesService.listar().subscribe({
      next: (p) => this.pacientes.set(p),
      error: (e) => this.mostrarError(e),
    });
  }

  private cargarMedicos(): void {
    this.medicosService.listar().subscribe({
      next: (lista) => {
        this.medicos.set(lista);
        for (const m of lista) this.valores[m.id] = m.valor_consulta;
      },
      error: (e) => this.mostrarError(e),
    });
  }

  private cargarTurnos(): void {
    this.reservasService.listar().subscribe({
      next: (t) => this.turnos.set(t),
      error: (e) => this.mostrarError(e),
    });
  }

  reservar(): void {
    this.mensaje.set(null);

    if (this.pacienteId === null || this.medicoId === null || !this.fecha) {
      this.mensaje.set({ tipo: 'error', texto: 'Elegí un paciente, un médico y una fecha' });
      return;
    }

    const hh = String(this.hora).padStart(2, '0');
    this.enviando.set(true);

    this.reservasService
      .crear({
        id_medico: this.medicoId,
        id_paciente: this.pacienteId,
        fecha_hora: `${this.fecha}T${hh}:00:00`,
      })
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.mensaje.set({ tipo: 'ok', texto: 'Turno reservado correctamente' });
          this.cargarTurnos();
        },
        error: (e) => {
          this.enviando.set(false);
          this.mostrarError(e);
        },
      });
  }

  // El administrador puede cancelar hasta el inicio de la consulta.
  puedeCancelar(t: Reserva): boolean {
    return t.estado === 'ACTIVO' && new Date(t.fecha_hora) > new Date();
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

  guardarValor(m: Medico): void {
    this.mensaje.set(null);
    const valor = Number(this.valores[m.id]);

    if (!valor || valor <= 0) {
      this.mensaje.set({ tipo: 'error', texto: 'El valor de la consulta debe ser mayor que cero' });
      return;
    }

    this.medicosService.actualizarValorConsulta(m.id, valor).subscribe({
      next: () => {
        this.mensaje.set({ tipo: 'ok', texto: `Valor de consulta de ${m.nombre} actualizado` });
        this.cargarMedicos();
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