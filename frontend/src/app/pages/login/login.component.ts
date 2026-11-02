import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { Rol } from '../../core/modelos';

const RUTA_POR_ROL: Record<Rol, string> = {
  PACIENTE: '/paciente',
  MEDICO: '/medico',
  ADMINISTRADOR: '/admin',
};

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})

export class LoginComponent {
  email = '';
  clave = '';
  error = signal('');
  cargando = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ingresar(): void {
    this.error.set('');
    this.cargando.set(true);

    this.auth.login({ nombre: this.email, clave: this.clave }).subscribe({
      next: () => {
        this.cargando.set(false);
        const rol = this.auth.rol();
        this.router.navigateByUrl(rol ? RUTA_POR_ROL[rol] : '/login');
      },
      error: (e) => {
        this.cargando.set(false);
        this.error.set(
          e.status === 401
            ? 'Usuario o contraseña incorrectos'
            : 'No se pudo conectar con el servidor',
        );
      },
    });
  }
}