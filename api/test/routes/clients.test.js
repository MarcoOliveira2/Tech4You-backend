const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const MAIN_ROUTE = '/v1/clients';
const secret = 'APIMARCOPINTO';

function getRandom() {
  return Math.floor(Math.random() * 99999999) + 1;
}

const client = { id: 10000, name: 'Bruno Faria', address: 'Gerês', BirhDate: '29-05-1998', phoneNumber: '961548614', email: 'brunoFaria@planeta.com', nif: 45654325 };
const technicianA = { id: 10000, name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '$2a$10$k7JP3zx/tuOEvhq5CPgMcediXLuRxTM/9EFfzm82qfa8gP3c9gchO', email: 'miguel@tech4you.pt' };
const TOKEN = jwt.encode(technicianA, secret);
const mailclient = `${Date.now()}@cliente.pt`;
const nifclient = `${getRandom()}`;

// async
beforeAll(() => {
  return app.db.seed.run();
});

test('Test #1 - Listar os Clientes', () => {
  return request(app).get(MAIN_ROUTE).set('authorization', `bearer ${TOKEN}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(-1);
    });
});

test('Test #2 - Inserir Clientes', () => {
  return request(app).post(MAIN_ROUTE).set('authorization', `bearer ${TOKEN}`)
    .send({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Marco Oliveira');
    });
});

describe('Test #2.1 - Inserir Clientes', () => {
  const testTemplateInserir = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}`, ...newData })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 2.1.1 - Inserir Clientes sem nome', () => testTemplateInserir({ name: null }, 'O Nome é um atributo obrigatório'));
  test('Test 2.1.2 - Inserir Clientes sem email', () => testTemplateInserir({ email: null }, 'O email é um atributo obrigatório'));
  test('Test 2.1.3 - Inserir Clientes sem morada', () => testTemplateInserir({ address: null }, 'A morada é um atributo obrigatório'));
  test('Test 2.1.4 - Inserir Clientes sem número telemóvel', () => testTemplateInserir({ phoneNumber: null }, 'O número de telemóvel é um atributo obrigatório'));
  test('Test 2.1.5 - Inserir Clientes sem data de nascimento', () => testTemplateInserir({ BirhDate: null }, 'A data de nascimento é um atributo obrigatório'));
  test('Test 2.1.5 - Inserir Clientes sem nif', () => testTemplateInserir({ nif: null }, 'O NIF é um atributo obrigatório'));
  test('Test 2.1.6 - Inserir Clientes com email duplicado', () => testTemplateInserir({ email: client.email }, 'Email duplicado na BD'));
  test('Test 2.1.7 - Inserir Clientes com nif duplicado', () => testTemplateInserir({ nif: client.nif }, 'Nif duplicado na BD'));
});

test('Test #3 - Listar Cliente por ID', () => {
  return app.db('clients')
    .insert({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}` }, ['id'])
    .then((cli) => request(app).get(`${MAIN_ROUTE}/${cli[0].id}`).set('authorization', `bearer ${TOKEN}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Marco Oliveira');
    });
});

test('Test #4 - Atualizar Cliente', () => {
  return app.db('clients')
    .insert({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}` }, ['id'])
    .then((cli) => request(app).put(`${MAIN_ROUTE}/${cli[0].id}`).set('authorization', `bearer ${TOKEN}`)
      .send({ name: 'Cliente Atualizado', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}` }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Cliente Atualizado');
    });
});

describe('Test #5.1 - Atualizar Clientes', () => {
  const testTemplateAtualizar = (newData, errorMessage) => {
    return app.db('clients')
      .insert({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}` }, ['id'])
      .then((cli) => request(app).put(`${MAIN_ROUTE}/${cli[0].id}`).set('authorization', `bearer ${TOKEN}`)
        .send({ name: 'Cliente Atualizado', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}`, ...newData }))
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 5.1.1 - Atualizar Clientes sem nome', () => testTemplateAtualizar({ name: null }, 'O Nome é um atributo obrigatório'));
  test('Test 5.1.2 - Atualizar Clientes sem email', () => testTemplateAtualizar({ email: null }, 'O email é um atributo obrigatório'));
  test('Test 5.1.3 - Atualizar Clientes sem morada', () => testTemplateAtualizar({ address: null }, 'A morada é um atributo obrigatório'));
  test('Test 5.1.4 - Atualizar Clientes sem número telemóvel', () => testTemplateAtualizar({ phoneNumber: null }, 'O número de telemóvel é um atributo obrigatório'));
  test('Test 5.1.5 - Atualizar Clientes sem data de nascimento', () => testTemplateAtualizar({ BirhDate: null }, 'A data de nascimento é um atributo obrigatório'));
  test('Test 5.1.5 - Atualizar Clientes sem nif', () => testTemplateAtualizar({ nif: null }, 'O NIF é um atributo obrigatório'));
});

test('Test #5 - Remover Cliente', () => {
  return app.db('clients')
    .insert({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: `${Date.now()}@cliente.pt`, nif: `${getRandom()}` }, ['id'])
    .then((cli) => request(app).delete(`${MAIN_ROUTE}/${cli[0].id}`).set('authorization', `bearer ${TOKEN}`)
      .send({ name: 'Marco Oliveira' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
