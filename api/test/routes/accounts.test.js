const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/accounts';
let technician;

const mail = `${Date.now()}@ipca.pt`;

beforeAll(async () => {
  const res = await app.services.technician.save({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: mail });
  technician = { ...res[0] };
});

test('Teste #17 - Inserir contas', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ name: 'Account #1', technician_id: technician.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Account #1');
    });
});
