const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
let technician;
const secret = 'APIMARCOPINTO';

const mail = `${Date.now()}@ipca.pt`;

beforeAll(async () => {
  const res = await app.services.technician.save({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: mail });
  technician = { ...res[0] };
  technician.token = jwt.encode(technician, secret);
});

test('Teste #7 - Inserir contas', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Account #1', technician_id: technician.id })
    .set('authorization', `bearer ${technician.token}`)
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Account #1');
    });
});

test('Test #8 - Listar contas', () => {
  return app.db('accounts')
    .insert({ name: 'Account #list', technician_id: technician.id })
    .then(() => request(app).get(MAIN_ROUTE).set('authorization', `bearer ${technician.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #9 - Listar conta por ID', () => {
  return app.db('accounts')
    .insert({ name: 'Account By id', technician_id: technician.id }, ['id'])
    .then((acc) => request(app).get(`${MAIN_ROUTE}/${acc[0].id}`).set('authorization', `bearer ${technician.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Account By id');
      expect(res.body.technician_id).toBe(technician.id);
    });
});

test('Test #10 - Atualizar conta', () => {
  return app.db('accounts')
    .insert({ name: 'Account - Update ', technician_id: technician.id }, ['id'])
    .then((acc) => request(app).put(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${technician.token}`)
      .send({ name: 'Account updated' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Account updated');
    });
});

test('Test #11 - Remover conta', () => {
  return app.db('accounts')
    .insert({ name: 'Account - Remove', technician_id: technician.id }, ['id'])
    .then((acc) => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
      .set('authorization', `bearer ${technician.token}`)
      .send({ name: 'Account removed' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});

test('Test #12 - Inserir conta sem nome', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${technician.token}`)
    .send({ technician_id: technician.id })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});
