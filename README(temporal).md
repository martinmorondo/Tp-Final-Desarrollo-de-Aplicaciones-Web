# Sistema de turnos para clínica médica

Trabajo Integrador - Desarrollo de Aplicaciones Web 2026 (Tecnicatura Universitaria en Desarrollo Web).
# Equipo de Desarrollo

* Nerina Bonnin
* Griselda Eggs
* Raúl Fabricio Fabian Galindez
* Martin Morondo
* Sergio Valdivienzo


# Stack obligatorio: **NestJS, TypeORM, PostgreSQL, nginx, PM2 y Angular**.

## Estructura del proyecto

```
/
├── backend/    API en NestJS + TypeORM + PostgreSQL
├── frontend/   Aplicación Angular
└── README.md   Esta guía
```

## Programas necesarios

- Node.js (versión LTS) y npm
- PostgreSQL (opcional: pgAdmin o DBeaver para ver la base)
- Git
- VS Code
- Angular CLI: `npm install -g @angular/cli`
- Nest CLI: `npm install -g @nestjs/cli`
- PM2: `npm install -g pm2`
- nginx (solo para la etapa de despliegue)

## Cómo levantar el backend

1. Entrar a la carpeta: `cd backend`
2. Instalar dependencias: `npm install`
3. Copiar `.env.example` a `.env` y completar los valores:

   | Variable | Descripción |
   |---|---|
   | `PORT` | Puerto del backend (3000) |
   | `DB_HOST` | Servidor de PostgreSQL (ej. `localhost`) |
   | `DB_PORT` | Puerto de PostgreSQL (5432) |
   | `DB_USERNAME` | Usuario de la base |
   | `DB_PASSWORD` | Clave de la base |
   | `DB_NAME` | Nombre de la base (crearla vacía antes) |
   | `JWT_SECRET` | Texto secreto para firmar los tokens |

   El archivo `.env` **no se sube** a Git ni se incluye en el zip con claves reales.
4. Iniciar en modo desarrollo: `npm run start:dev`
5. Verificar en el navegador:
   - API: `http://localhost:3000/api/v1/...`
   - Swagger: `http://localhost:3000/api/docs`

> **Pendiente:** las tablas y los usuarios de prueba todavía no tienen un script que los cree (ver "Pendientes"). Sin eso no se puede iniciar sesión contra el backend real.

## Cómo levantar el frontend

1. Entrar a la carpeta: `cd frontend`
2. Instalar dependencias: `npm install`
3. Iniciar: `npm start` (usa `proxy.conf.json`)
4. Abrir `http://localhost:4200`

### Proxy de desarrollo

El frontend llama siempre a rutas **relativas** (`/api/v1/...`). En desarrollo, `proxy.conf.json` redirige `/api` a `http://localhost:3000`. Así no se escriben URLs del backend en el código. El script `start` de `package.json` ya incluye `--proxy-config proxy.conf.json`.

## Mock del backend (solo para desarrollo)

Mientras el backend o la base de datos no estén disponibles, el frontend puede funcionar con datos simulados.

- Se activa con `USAR_MOCK = true` en `frontend/src/app/core/config.ts`.
- La lógica está en `frontend/src/app/core/mock.interceptor.ts`.
- Los datos viven en memoria y se reinician al recargar la página.

Usuarios del mock (clave `1234`):

| Email | Rol |
|---|---|
| `paciente@test.com` | PACIENTE |
| `medico@test.com` | MEDICO (Gregory House) |
| `admin@test.com` | ADMINISTRADOR |

### ------------ Hay que probar el backend antes de cerrar el trabajo ----------

1. Poner `USAR_MOCK = false` y probar los tres roles con el backend real y usuarios de la base.
2. Borrar `mock.interceptor.ts` y `config.ts`, y quitar `mockInterceptor` de `frontend/src/app/app.config.ts` (import y línea de `provideHttpClient`, que debe quedar `withInterceptors([authInterceptor])`).
3. Borrar el token falso del navegador: `F12` → *Application* → *Local Storage* → clave `token`.
4. Buscar restos con `Ctrl + Shift + F`: `mock` y `USAR_MOCK` no debería aparecer

## Estructura actual del frontend (`frontend/src/app`)

```
core/        Lógica compartida
  auth.service.ts          Login, token y sesión (rol, id, nombre)
  auth.interceptor.ts      Agrega el token a cada pedido
  rol.guard.ts             Restringe rutas según el rol
  reservas.service.ts      Llamadas a /api/v1/reservas
  medicos.service.ts       Llamadas a /api/v1/medicos
  pacientes.service.ts     Llamada a /api/v1/usuarios/pacientes
  modelos.ts               Interfaces (Reserva, Medico, Rol, etc.)
  config.ts / mock.interceptor.ts   Mock temporal
pages/       Una carpeta por pantalla (login, paciente, medico, admin)
shared/      Componentes comunes (navbar)
app.routes.ts              Rutas y guards por rol
```

### Cómo agregar una pantalla nueva

1. Crear el componente: `ng g c pages/<carpeta>/<nombre> --type=component`
2. Agregar su ruta en `app.routes.ts` con `canActivate: [rolGuard(['ROL'])]`.
3. Agregar el link en `MENU_POR_ROL` dentro de `shared/navbar/navbar.component.ts`.

## Reglas de negocio (la validación final siempre la hace el backend)

- Horario de atención: 8 a 16 hs, turnos de una hora.
- No se puede reservar un horario ocupado.
- Reservas con un máximo de 30 días de anticipación.
- El valor de la consulta se congela al reservar.
- **Paciente:** reserva, lista y cancela sus turnos (hasta el día anterior).
- **Médico:** ve sus turnos por fecha y los marca atendido o ausente.
- **Administrador:** reserva para un paciente, lista, cancela (hasta el inicio de la consulta) y modifica el valor de la consulta.

## Estado actual

| Parte | Estado |
|---|---|
| Backend: login, roles, reservas, médicos | Hecho |
| Frontend: base (login, token, guards, menú) | Hecho |
| Frontend: pantalla de paciente | Hecho y testeado con mock |
| Frontend: pantalla de médico | Hecho y testead con mock |
| Frontend: pantalla de administrador | Hecho y testeadocon mock |
| Probar todo inegrando el backend real | Pendiente |

## Pendientes

Backend
- Endpoint `GET /api/v1/usuarios/pacientes` (solo ADMINISTRADOR): devuelve `[{ id, nombre }]` de los usuarios con rol PACIENTE y estado ACTIVO. La pantalla del admin lo necesita.
- Script SQL (o migración inicial) con las tablas y usuarios de prueba, con claves hasheadas con bcrypt.
- Ajustar el modelo al diagrama de la consigna: `valor_consulta` (medicos y reservas) y `matricula` como `INT`, y `email` sin `UNIQUE`. Si cambia el tipo de `matricula`, avisar para ajustar el frontend.
- [ Leer el puerto desde `PORT` en `main.ts` (hoy está fijo en 3000).
- DTOs de salida para el login y la creación de reserva (criterio 2: DTOs de entrada y salida).
-  Login solo por email (hoy también busca por `nombres`).
- Revisar la zona horaria (las validaciones de horario usan la hora local del servidor).
-  Limpiar archivos duplicados (`src/reservas`, `src/usuarios`, `modules/auth/entities`) y reparar o quitar el test e2e por defecto.

Despliegue
-  `ecosystem.config.cjs` de PM2 para el backend.
-  Configuración de nginx: servir el `dist` de Angular y redirigir `/api` al backend.
