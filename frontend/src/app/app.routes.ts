import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { PacienteComponent } from './pages/paciente/paciente.component';
import { MedicoComponent } from './pages/medico/medico.component';
import { AdminComponent } from './pages/admin/admin.component';
import { rolGuard } from './core/rol.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'paciente', component: PacienteComponent, canActivate: [rolGuard(['PACIENTE'])] },
  { path: 'medico', component: MedicoComponent, canActivate: [rolGuard(['MEDICO'])] },
  { path: 'admin', component: AdminComponent, canActivate: [rolGuard(['ADMINISTRADOR'])] },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];