import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, VersioningType, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module.js';

describe('API Clínica (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
  }),
);

    app.setGlobalPrefix('api');
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    await app.init();
  });

  it('GET /api/v1/medicos - debe responder correctamente', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/medicos')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('GET /api/v1/medicos?estado=ACTIVO - debe devolver médicos activos', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/medicos?estado=ACTIVO')
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);

    expect(
      response.body.every(
        (medico: { estado: string }) => medico.estado === 'ACTIVO',
      ),
    ).toBe(true);
  });

  it('GET /api/v1/medicos?estado=BAJA - debe devolver médicos dados de baja', async () => {
  const response = await request(app.getHttpServer())
    .get('/api/v1/medicos?estado=BAJA')
    .expect(200);

  expect(Array.isArray(response.body)).toBe(true);

  expect(
    response.body.every(
      (medico: { estado: string }) => medico.estado === 'BAJA',
    ),
  ).toBe(true);
});

it('GET /api/v1/medicos/2 - debe devolver el detalle del médico', async () => {
  const response = await request(app.getHttpServer())
    .get('/api/v1/medicos/2')
    .expect(200);

  expect(response.body).toHaveProperty('id', 2);
  expect(response.body).toHaveProperty('nombre');
  expect(response.body).toHaveProperty('matricula');
  expect(response.body).toHaveProperty('valor_consulta');
  expect(response.body).toHaveProperty('estado');
});

it('GET /api/v1/medicos/999999 - debe devolver 404 si no existe', async () => {
  const response = await request(app.getHttpServer())
    .get('/api/v1/medicos/999999')
    .expect(404);

  expect(response.body.statusCode).toBe(404);
});

it('GET /api/v1/medicos/abc - debe devolver 400 si el ID no es numérico', async () => {
  const response = await request(app.getHttpServer())
    .get('/api/v1/medicos/abc')
    .expect(400);

  expect(response.body.statusCode).toBe(400);
});

it('GET /api/v1/Reservas - debe rechazar el acceso sin token', async () => {
  const response = await request(app.getHttpServer())
    .get('/api/v1/Reservas')
    .expect(401);

  expect(response.body.statusCode).toBe(401);
});

it('POST /api/v1/auth/login - debe rechazar credenciales incorrectas', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth')
    .send({
      email: 'usuario_inexistente@test.com',
      clave: 'ClaveIncorrecta123',
    })
    .expect(401);

  expect(response.body.statusCode).toBe(401);
});

it('POST /api/v1/auth/login - debe rechazar una solicitud sin contraseña', async () => {
  const response = await request(app.getHttpServer())
    .post('/api/v1/auth')
    .send({
      email: 'admin@test.com',
    })
    .expect(400);

  expect(response.body.statusCode).toBe(400);
});

  afterAll(async () => {
    await app.close();
  });
});