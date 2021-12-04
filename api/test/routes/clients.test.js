const request = require('supertest');

const app = require('../../src/app');

function getRandom() {
  return Math.floor(Math.random() * 99999999) + 1;
}

const mailclient = `${Date.now()}@cliente.pt`;
const nifclient = `${getRandom()}`;

test('Test #1 - Listar os Clientes', () => {
  return request(app).get('/clients')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(-1);
    });
});

test('Test #2 - Inserir Clientes', () => {
  return request(app).post('/clients')
    .send({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Marco Oliveira');
    });
});

test('Test #3 - Inserir cliente sem nome', () => {
  return request(app).post('/clients')
    .send({ address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});
