import { Component, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService } from '../../core/auth.service';
import { Rol, Sesion } from '../../core/modelos';

interface ItemMenu {
  etiqueta: string;
  ruta: string;
}

// Cada integrante agrega acá los links de su módulo.
const MENU_POR_ROL: Record<Rol, ItemMenu[]> = {
  PACIENTE: [{ etiqueta: 'Mis turnos', ruta: '/paciente' }],
  MEDICO: [{ etiqueta: 'Mi agenda', ruta: '/medico' }],
  ADMINISTRADOR: [{ etiqueta: 'Administración', ruta: '/admin' }],
};

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  sesion = signal<Sesion | null>(null);
  menu = signal<ItemMenu[]>([]);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {
    this.actualizar();
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.actualizar());
  }

  private actualizar(): void {
    const s = this.auth.sesion();
    this.sesion.set(s);
    this.menu.set(s ? MENU_POR_ROL[s.rol] : []);
  }

  cerrarSesion(): void {
    this.auth.logout();
    this.actualizar();
    this.router.navigateByUrl('/login');
  }
}