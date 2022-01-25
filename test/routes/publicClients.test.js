const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/public/publicClients';

function getRandom() {
  return Math.floor(Math.random() * 99999999) + 1;
}

test('Test #3 - Listar Cliente por ID', () => {
  return app.db('clients')
    .insert({
      name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}`,
    }, ['id'])
    .then((cli) => request(app).get(`${MAIN_ROUTE}/${cli[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Marco Oliveira');
    });
});
