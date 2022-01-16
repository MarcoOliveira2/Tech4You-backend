const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/technicians';

const mail = `${Date.now()}@ipca.pt`;
const secret = 'APIMARCOPINTO';

const technician = { id: 10000, name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '$2a$10$k7JP3zx/tuOEvhq5CPgMcediXLuRxTM/9EFfzm82qfa8gP3c9gchO', email: 'miguel@tech4you.pt' };
const TOKEN = jwt.encode(technician, secret);

beforeAll(() => {
  return app.db.seed.run();
});

test('Test #1 - Listar os Técnicos', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - Inserir Técnicos', () => {
  return request(app).post('/auth/signup')
    .set('authorization', `bearer ${TOKEN}`)
    .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '12345', email: `${Date.now()}@ipca.pt` })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Miguel Pinto');
      expect(res.body).not.toHaveProperty('password');
    });
});

describe('Test #2.1 - Inserir Técnicos', () => {
  const testTemplateInserir = (newData, errorMessage) => {
    return request(app).post('/auth/signup')
      .set('authorization', `bearer ${TOKEN}`)
      .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '12345', email: `${Date.now()}@ipca.pt`, ...newData })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 2.1.1 - Inserir Técnicos sem nome', () => testTemplateInserir({ name: null }, 'O Nome é um atributo obrigatório'));
  test('Test 2.1.2 - Inserir Técnicos sem email', () => testTemplateInserir({ email: null }, 'O email é um atributo obrigatório'));
  test('Test 2.1.3 - Inserir Técnicos sem password', () => testTemplateInserir({ password: null }, 'A palavra-passe é um atributo obrigatório'));
  test('Test 2.1.4 - Inserir Técnicos sem morada', () => testTemplateInserir({ address: null }, 'A morada é um atributo obrigatório'));
  test('Test 2.1.5 - Inserir Técnicos sem data de nascimento', () => testTemplateInserir({ BirhDate: null }, 'A data de nascimento é um atributo obrigatório'));
  test('Test 2.1.6 - Inserir Técnicos com email duplicado', () => testTemplateInserir({ email: technician.email }, 'Email duplicado na BD'));
});

test('Test #3 - Guardar a palavra-passe encriptada', async () => {
  const res = await request(app).post('/auth/signup')
    .set('authorization', `bearer ${TOKEN}`)
    .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` });
  expect(res.status).toBe(201);
  const { id } = res.body;
  const technicianDB = await app.services.technician.find({ id });
  expect(technicianDB.password).not.toBeUndefined();
  expect(technicianDB.password).not.toBe('admin');
});

test('Test #4 - Listar técnico por ID', () => {
  return app.db('technicians')
    .insert({
      name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt`
    }, ['id'])
    .then((tech) => request(app).get(`${MAIN_ROUTE}/${tech[0].id}`).set('authorization', `bearer ${TOKEN}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Miguel Pinto');
    });
});

test('Test #5 - Atualizar técnico', () => {
  return app.db('technicians')
    .insert({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` }, ['id'])
    .then((tech) => request(app).put(`${MAIN_ROUTE}/${tech[0].id}`).set('authorization', `bearer ${TOKEN}`)
      .send({ name: 'Nome atualizado', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Nome atualizado');
    });
});

describe('Test #5.1 - Atualizar Técnicos', () => {
  const testTemplateAtualizar = (newData, errorMessage) => {
    return app.db('technicians')
      .insert({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` }, ['id'])
      .then((tech) => request(app).put(`${MAIN_ROUTE}/${tech[0].id}`).set('authorization', `bearer ${TOKEN}`)
        .send({ name: 'Nome atualizado', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt`, ...newData }))
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 5.1.1 - Atualizar Técnicos sem nome', () => testTemplateAtualizar({ name: null }, 'O Nome é um atributo obrigatório'));
  test('Test 5.1.2 - Atualizar Técnicos sem email', () => testTemplateAtualizar({ email: null }, 'O email é um atributo obrigatório'));
  test('Test 5.1.3 - Atualizar Técnicos sem password', () => testTemplateAtualizar({ password: null }, 'A palavra-passe é um atributo obrigatório'));
  test('Test 5.1.4 - Atualizar Técnicos sem morada', () => testTemplateAtualizar({ address: null }, 'A morada é um atributo obrigatório'));
  test('Test 5.1.5 - Atualizar Técnicos sem data de nascimento', () => testTemplateAtualizar({ BirhDate: null }, 'A data de nascimento é um atributo obrigatório'));
});

test('Test #6 - Remover técnico', () => {
  return app.db('technicians')
    .insert({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` }, ['id'])
    .then((tech) => request(app).delete(`${MAIN_ROUTE}/${tech[0].id}`).set('authorization', `bearer ${TOKEN}`)
      .send({ name: 'Miguel Pinto' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
