# Sistema de turnos para clínica médica

Trabajo Integrador - Desarrollo de Aplicaciones Web 2026 (Tecnicatura Universitaria en Desarrollo Web).

Aplicación web para reservar y gestionar turnos médicos. Hay tres tipos de usuario: **paciente**, **médico** y **administrador**.

**Tecnologías:** NestJS, TypeORM, PostgreSQL, Angular, nginx y PM2.

# Equipo de Desarrollo

* Nerina Bonnin
* Griselda Eggs
* Raúl Fabricio Fabian Galindez
* Martin Morondo
* Sergio Valdivienzo

**Video de la demostración:** (completar con el enlace)

---

## 1. Qué hay en cada carpeta

| Carpeta o archivo | Qué contiene |
|---|---|
| `backend/` | La API (NestJS + TypeORM) |
| `backend/database/clinica.sql` | Script que crea las tablas y carga datos de prueba |
| `backend/ecosystem.config.cjs` | Configuración de PM2 |
| `frontend/` | La aplicación web (Angular) |
| `deploy/nginx.conf` | Configuración de nginx |

---

## 2. Programas necesarios

- **Node.js** (versión LTS)
- **PostgreSQL** (con pgAdmin)
- **Angular CLI:** `npm install -g @angular/cli`
- **PM2:** `npm install -g pm2`
- **nginx** (solo para el paso 6): descargar el zip para Windows desde nginx.org y descomprimirlo en `C:\nginx` (una ruta corta y sin espacios, la idea justamente es para evitar cualquier conflicto de rutas con el código).

---

## 3. Crear la base de datos

1. Abrir **pgAdmin** y crear una base vacía llamada `clinica` (clic derecho en *Databases* -- *Create* -- *Database*).
2. Clic derecho sobre `clinica` -- *Query Tool*.
3. Abrir el archivo `backend/database/clinica.sql` y ejecutarlo (tecla **F5**).

> Ese script borra y vuelve a crear las tablas. Sirve también para volver a los datos iniciales.

---

## 4. Empezamo con arrancar el backend

1. En la carpeta `backend`, copiar el archivo `.env.example` y renombrar la copia a `.env`.
2. Completar el `.env`:

```
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=la_clave_de_tu_postgres
DB_NAME=clinica
JWT_SECRET=cualquier_texto_largo
```

   - `DB_PORT` es el puerto de tu PostgreSQL. Si no es el 5432, se ve en pgAdmin (clic derecho sobre el servidor → *Properties* → *Connection*).
3. En una terminal (en este caso, VS Studio, abriendo desde la carpeta del proyecto):

```
cd backend
npm install
npm run start:dev
```

4. Esperar el mensaje "Nest application successfully started". Dejar esa terminal abierta.
5. Comprobar que funciona abriendo `http://localhost:3001/api/docs` (Swagger)

---

## 5. Ahora, hay que arrancar el frontend

En **una nueva terminal** (el backend sigue corriendo en la primera), desde VS Studio crear una nueva terminal manteniendo la misma instancia del backend:

```
cd frontend
npm install
npm start
```

Abrir `http://localhost:4200`. Tiene que aparecer el login.

El frontend llama siempre a rutas relativas (`/api/...`). El archivo `frontend/proxy.conf.json` las redirige al backend (`http://localhost:3001`). Si cambia el puerto del backend, hay que cambiarlo también ahí.

---

## 6. Ejecutar con PM2 y nginx

Es la forma de dejar el sistema funcionando como en un servidor real. Antes, **detener** el backend del paso 4 (`Ctrl + C`), ya que usa el mismo puerto y no hace falta mantenerlo activo.

**Backend con PM2**

```
cd backend
npm run build
pm2 start ecosystem.config.cjs
pm2 status
```

En la tabla tiene que figurar `clinica-backend` como `online`.

**Frontend con nginx**

1. Compilar Angular y copiarlo a nginx (es una opción más práctica que hemos visto para llevar los archivos a nginx):

```
cd frontend
ng build
xcopy /E /I /Y "dist\frontend\browser" "C:\nginx\html\clinica"
```

2. Copiar la configuración de nginx:

```
copy deploy\nginx.conf C:\nginx\conf\nginx.conf
```

3. Verificar y arrancar nginx (puede ser en VS Studio, o CMD/Powershell):

```
cd C:\nginx
.\nginx.exe -t
start nginx
```

4. Abrir **`http://localhost`** (sin puerto). Tiene que aparecer el login.

**Comandos que podrían servir**

| Qué hace | Comando |
|---|---|
| Ver el estado del backend | `pm2 status` |
| Ver el log del backend | `pm2 logs clinica-backend` |
| Detener el backend | `pm2 stop clinica-backend` |
| Detener nginx | `.\nginx.exe -s stop` (desde `C:\nginx`) |
| Recargar la configuración de nginx | `.\nginx.exe -s reload` (solo si nginx ya está corriendo) |

**Si se cambia el código:** PM2 y nginx usan una copia compilada, así que hay que recompilar.
- Backend: `npm run build` y después `pm2 restart clinica-backend`.
- Frontend: `ng build` y volver a copiar con `xcopy`.

---

## 7. Usuarios de prueba

# Todos tienen la clave `1234`. Se ingresa con el email

| Email | Rol |
|---|---|
| `admin@test.com` | Administrador (Ana) |
| `medico@test.com` | Médico (Carlos Federico) |
| `medico2@test.com` | Médico (Laura Yampara) |
| `paciente@test.com` | Paciente 1 (Paula) |
| `paciente2@test.com` | Paciente 2 (Pedro) |
| `paciente3@test.com` | Paciente 3 (Lucia) |
| `baja@test.com` | Paciente dado de baja (no puede iniciar sesión) |

---

## 8. Cómo se usa

**Paciente**
- Reserva un turno: elige médico y fecha, y el sistema muestra solo los horarios libres.
- En "Mis turnos" ve sus reservas y puede cancelar hasta el día anterior a la consulta.

**Médico**
- En "Mi agenda" elige una fecha y ve sus turnos de ese día.
- Cuando el turno ya comenzó, lo marca como **Atendido** o **Ausente**.

**Administrador**
- Reserva un turno a nombre de un paciente.
- Ve todos los turnos y puede cancelarlos hasta el inicio de la consulta.
- Modifica el valor de la consulta de cada médico. Los turnos ya reservados conservan el valor que tenían.

---

## 9. Reglas del sistema

- Atención de **8 a 16 hs**, con turnos de una hora.
- No se puede reservar un horario que ya está ocupado.
- Se puede reservar hasta **30 días** antes.
- El valor de la consulta **se congela** en el momento de reservar.
- Solo pueden iniciar sesión los usuarios en estado **ACTIVO**.

---

## 10. Documentación

- **Swagger** (la API y sus endpoints): `http://localhost:3001/api/docs`, o `http://localhost/api/docs` si se usa nginx.
- **Compodoc** (documentación del código del backend):

```
cd backend
npm run docs
npm run docs:serve
```

Abrir `http://localhost:8080`.

---

## 11. Modelo de datos

Sigue el diagrama de la consigna, con tres tablas:
- `usuarios` (con rol y estado)
- `medicos` (matrícula y valor de la consulta, vinculados a un usuario)
- `reservas` (médico, paciente, fecha y hora, estado y valor de la consulta)

---

## 12. Problemas frecuentes

| Síntoma | Qué revisar |
|---|---|
| El backend no arranca: `ECONNREFUSED` | `DB_PORT` del `.env` no coincide con el puerto de PostgreSQL, o PostgreSQL no está en ejecución |
| `password authentication failed` | La clave `DB_PASSWORD` es incorrecta (la predeterminada que usamos hemos siempre es "1234") |
| El login dice "No se pudo conectar con el servidor" | El backend está apagado: ver `pm2 status` o la terminal del paso 4 |
| Error 502 en nginx | El backend no está corriendo |
| `nginx -s reload` da error de PID | nginx está apagado: usar `start nginx` |
| nginx muestra "Welcome to nginx!" | Falta copiar `deploy\nginx.conf` o reiniciar nginx |