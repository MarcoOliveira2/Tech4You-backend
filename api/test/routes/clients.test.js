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

test('Test #4 - Inserir cliente sem email', async () => {
  const result = await request(app).post('/clients')
    .send({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', nif: nifclient });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O email é um atributo obrigatório');
});

test('Test #5 - Inserir cliente sem morada', () => {
  return request(app).post('/clients')
    .send({ name: 'Marco Oliveira', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A morada é um atributo obrigatório');
    });
});

test('Test #6 - Inserir cliente sem data de nascimento', () => {
  return request(app).post('/clients')
    .send({ name: 'Marco Oliveira', address: 'Pedome', phoneNumber: '961548614', email: mailclient, nif: nifclient })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A data de nascimento é um atributo obrigatório');
    });
});

test('Test #7 - Inserir cliente sem numero de telemovel', () => {
  return request(app).post('/clients')
    .send({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', email: mailclient, nif: nifclient })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('O numero de telémovel é um atributo obrigatório');
    });
});
