import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../core/reservas.service';
import { EstadoReserva, Reserva } from '../../core/modelos';

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
  selector: 'app-medico',
  imports: [FormsModule, DatePipe],
  templateUrl: './medico.component.html',
  styleUrl: './medico.component.css',
})
export class MedicoComponent implements OnInit {
  turnos = signal<Reserva[]>([]);
  mensaje = signal<Mensaje | null>(null);
  fecha = aTextoFecha(new Date());

  constructor(private reservasService: ReservasService) {}

  ngOnInit(): void {
    this.cargar();
  }

  cambiarFecha(nueva: string): void {
    this.fecha = nueva;
    this.cargar();
  }

  private cargar(): void {
    if (!this.fecha) {
      this.turnos.set([]);
      return;
    }
    this.reservasService.listarPorMedicoYFecha(this.fecha).subscribe({
      next: (t) => this.turnos.set(t),
      error: (e) => this.mostrarError(e),
    });
  }

  // Solo se puede registrar el resultado de turnos que ya comenzaron.
  yaComenzo(t: Reserva): boolean {
    return new Date(t.fecha_hora) <= new Date();
  }

  marcar(t: Reserva, estado: EstadoReserva): void {
    this.mensaje.set(null);
    this.reservasService.cambiarEstado(t.id, estado).subscribe({
      next: () => {
        const texto = estado === 'ATENDIDO' ? 'Turno marcado como atendido' : 'Turno marcado como ausente';
        this.mensaje.set({ tipo: 'ok', texto });
        this.cargar();
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