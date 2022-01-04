const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const MAIN_ROUTE = '/v1/accounts';
let technician;
let technician2;
const secret = 'APIMARCOPINTO';

const mail = `${Date.now()}@ipca.pt`;

beforeEach(async () => {
  const res = await app.services.technician.save({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` });
  technician = { ...res[0] };
  technician.token = jwt.encode(technician, secret);
  const res2 = await app.services.technician.save({ name: 'Miguel Pinto #2', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` });
  technician2 = { ...res2[0] };
});

test('Teste #7 - Inserir contas', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Account #1' })
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
    .send({})
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});

test('Test #13 - Listar apenas as contas do utilizador', () => {
  return app.db('accounts')
    .insert([
      { name: 'Account T #1', technician_id: technician.id },
      { name: 'Account T #2', technician_id: technician2.id },
    ]).then(() => request(app).get(MAIN_ROUTE)
      .set('authorization', `bearer ${technician.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Account T #1');
    });
});
