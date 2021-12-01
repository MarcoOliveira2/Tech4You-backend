const request = require('supertest');

const app = require('../../src/app');

const mail = `${Date.now()}@ipca.pt`;

test('Test #1 - Listar os Técnicos', () => {
  return request(app).get('/technicians')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - Inserir Técnicos', () => {
  return request(app).post('/technicians')
    .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: mail })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Miguel Pinto');
    });
});
