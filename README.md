# Sistema de turnos - Clínica

Trabajo Integrador - Desarrollo de Aplicaciones Web 2026.

## Estructura

- `backend/`: API en NestJS (prefijo `/api`, versión `/v1`).
- `frontend/`: aplicación Angular.
- `backend/database/clinica.sql`: crea las tablas según el modelo de la consigna y carga datos de prueba.

## Puesta en marcha

### 1. Base de datos
1. Crear una base vacía en PostgreSQL llamada `clinica` (pgAdmin → clic derecho en *Databases* → *Create*).
2. Abrir el Query Tool sobre `clinica`, cargar `backend/database/clinica.sql` y ejecutarlo (F5).
   **Borra y recrea las tablas.** Sirve también para volver a los datos iniciales.

### 2. Backend
```
cd backend
copy .env.example .env      (completar el .env)
npm install
npm run start:dev
```

Variables del `.env`:

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=<tu clave>
DB_NAME=clinica
JWT_SECRET=<texto largo cualquiera>
```

- `DB_PORT` debe coincidir con el puerto de tu PostgreSQL (se ve en pgAdmin → *Properties* → *Connection*).
- Swagger: `http://localhost:3001/api/docs`.

### 3. Frontend (en otra terminal)
```
cd frontend
npm install
npm start
```
Abrir `http://localhost:4200`.

`proxy.conf.json` redirige `/api` al backend, así que el frontend usa solo rutas relativas.
Si cambian `PORT` del backend, hay que cambiar también el `target` de ese archivo.

## Usuarios de prueba (clave `1234`)

| Email | Rol |
|---|---|
| `admin@test.com` | Administrador |
| `medico@test.com` | Médico (Gregory House, $15.000) |
| `medico2@test.com` | Médico (Meredith Grey, $18.000) |
| `paciente@test.com` / `paciente2@test.com` / `paciente3@test.com` | Pacientes |
| `baja@test.com` | Paciente en BAJA (no puede iniciar sesión) |

El login es solo por email. Al ingresar, cada rol va a su pantalla.

## Como funciona??

**Paciente**
- Reservar: elegir médico y fecha; el selector de hora muestra solo los horarios libres
- "Mis turnos" lista sus turnos y permite cancelar hasta el día anterior a la consulta

**Médico**
- "Mi agenda": elegir una fecha para ver sus turnos
- Si el turno ya comenzó, puede marcarlo como **Atendido** o **Ausente**

**Administrador**
- Reservar un turno a nombre de un paciente
- Ver todos los turnos y cancelar (hasta el inicio de la consulta)
- Modificar el valor de la consulta de cada médico. Los turnos ya reservados conservan el valor que tenían

## Reglas de negocio (las valida el backend)

- Atención de 8 a 16 hs, turnos de una hora
- No se puede reservar un horario ocupado
- Máximo 30 días de anticipación
- El valor de la consulta se congela al reservar

## Endpoints principales

| Método y ruta | Quién |
|---|---|
| `POST /api/v1/auth` | Todos (login) |
| `GET /api/v1/reservas` | Paciente (las suyas) / Administrador (todas) |
| `POST /api/v1/reservas` | Paciente / Administrador |
| `PUT /api/v1/reservas/:id` | Cambiar estado (cancelar, atendido, ausente) |
| `GET /api/v1/reservas/medico?fecha=` | Médico |
| `GET /api/v1/reservas/disponibilidad?id_medico=&fecha=` | Paciente / Administrador |
| `GET /api/v1/medicos` | Autenticados |
| `PUT /api/v1/medicos/:id` | Administrador (valor de consulta) |
| `GET /api/v1/usuarios/pacientes` | Administrador |

## Estado

- Backend: login, roles, reservas, médicos, disponibilidad, DTOs
- Modelo de datos según la consigna y script SQL
- Frontend: login, guards por rol, pantallas de paciente, médico y administrador
- Probado de punta a punta con el backend real

## Falta
- PM2 y nginx
-  Regenerar Compodoc
   README final, video y zip para entregar
