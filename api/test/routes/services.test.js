const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const secret = 'APIMARCOPINTO';
const MAIN_ROUTE = '/v1/services';

const technician = { id: 10000, name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '$2a$10$k7JP3zx/tuOEvhq5CPgMcediXLuRxTM/9EFfzm82qfa8gP3c9gchO', email: 'miguel@tech4you.pt' };
const client = { id: 10000, name: 'Bruno Faria', address: 'Gerês', BirhDate: '29-05-1998', phoneNumber: '961548614', email: 'brunoFaria@planeta.com', nif: 45654325 };
const equipment = { id: 10000, typeEquipment: 'Laptop', serialNumber: 43566323, brand: 'Apple', accessories: 'Charger', damages: 'Hinge damage', client_id: 10001 };
const TOKEN = jwt.encode(technician, secret);

function getRandomNif() {
  return Math.floor(Math.random() * 99999999) + 1;
}

const mailclient = `${Date.now()}@cliente.pt`;
const nifclient = `${getRandomNif()}`;

beforeAll(async () => {
  return app.db.seed.run();
});

test('Test #1 - Listar Serviços', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - Inserir Serviço', () => {
  return request(app).post(MAIN_ROUTE)
    .set('authorization', `bearer ${TOKEN}`)
    .send({ status: 'Pending', description: 'Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.description).toBe('Avaria na dobradiça');
    });
});

describe('Test #2.1 - Inserir Serviço', () => {
  const testTemplateInserir = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ status: 'Pending', description: 'Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id, ...newData })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Test 2.1.1 - Inserir Serviço com estado inválido', () => testTemplateInserir({ status: 'Errado' }, 'Tipo de estado inválido'));
  test('Test 2.1.2 - Inserir Serviço sem descrição', () => testTemplateInserir({ description: null }, 'A descrição é um atributo obrigatório'));
  test('Test 2.1.3 - Inserir Serviço sem observações', () => testTemplateInserir({ observations: null }, 'As observações são um atributo obrigatório'));
  test('Test 2.1.4 - Inserir Serviço sem data de inicio', () => testTemplateInserir({ startDate: null }, 'A data de inicio é um atributo obrigatório'));
  test('Test 2.1.5 - Inserir Serviço sem data de finalização', () => testTemplateInserir({ endDate: null }, 'A data estimada de finalização é um atributo obrigatório'));
  test('Test 2.1.6 - Inserir Serviço sem testes', () => testTemplateInserir({ tests: null }, 'Os testes efetuados é um atributo obrigatório'));
  test('Test 2.1.7 - Inserir Serviço sem componentes', () => testTemplateInserir({ components: null }, 'Os componentes são um atributo obrigatório'));
  test('Test 2.1.8 - Inserir Serviço sem Id de técnico', () => testTemplateInserir({ technician_id: null }, 'O Id do técnico responsável é um atributo obrigatório'));
  test('Test 2.1.9 - Inserir Serviço sem Id de equipamento', () => testTemplateInserir({ equipment_id: null }, 'O Id do equipamento é um atributo obrigatório'));
  test('Test 2.1.10 - Inserir Serviço com estado inválido', () => testTemplateInserir({ status: null }, 'O estado é um atributo obrigatório'));
});

test('Test #3 - Listar serviço por ID', () => {
  return app.db('services')
    .insert({ status: 'Pending', description: 'Listar ID Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id }, ['id'])
    .then((serv) => request(app).get(`${MAIN_ROUTE}/${serv[0].id}`).set('authorization', `bearer ${TOKEN}`))

    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.description).toBe('Listar ID Avaria na dobradiça');
      expect(res.body.technician_id).toBe(technician.id);
      expect(res.body.equipment_id).toBe(equipment.id);
    });
});

test('Test #4 - Atualizar serviço', () => {
  return app.db('services')
    .insert({ status: 'Pending', description: 'UPDATE Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id }, ['id'])
    .then((serv) => request(app).put(`${MAIN_ROUTE}/${serv[0].id}`)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ status: 'Pending', description: 'UPDATED Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.description).toBe('UPDATED Avaria na dobradiça');
    });
});

describe('Test #4.1 - Atualizar Técnicos', () => {
  const testTemplateAtualizar = (newData, errorMessage) => {
    return app.db('services')
      .insert({ status: 'Pending', description: 'UPDATE Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id }, ['id'])
      .then((serv) => request(app).put(`${MAIN_ROUTE}/${serv[0].id}`)
        .set('authorization', `bearer ${TOKEN}`)
        .send({ status: 'Pending', description: 'UPDATED Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id, ...newData }))
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Test 4.1.1 - Atualizar Serviço com estado inválido', () => testTemplateAtualizar({ status: 'Errado' }, 'Tipo de estado inválido'));
  test('Test 4.1.2 - Atualizar Serviço sem descrição', () => testTemplateAtualizar({ description: null }, 'A descrição é um atributo obrigatório'));
  test('Test 4.1.3 - Atualizar Serviço sem observações', () => testTemplateAtualizar({ observations: null }, 'As observações são um atributo obrigatório'));
  test('Test 4.1.4 - Atualizar Serviço sem data de inicio', () => testTemplateAtualizar({ startDate: null }, 'A data de inicio é um atributo obrigatório'));
  test('Test 4.1.5 - Atualizar Serviço sem data de finalização', () => testTemplateAtualizar({ endDate: null }, 'A data estimada de finalização é um atributo obrigatório'));
  test('Test 4.1.6 - Atualizar Serviço sem testes', () => testTemplateAtualizar({ tests: null }, 'Os testes efetuados é um atributo obrigatório'));
  test('Test 4.1.7 - Atualizar Serviço sem componentes', () => testTemplateAtualizar({ components: null }, 'Os componentes são um atributo obrigatório'));
  test('Test 4.1.8 - Atualizar Serviço sem Id de técnico', () => testTemplateAtualizar({ technician_id: null }, 'O Id do técnico responsável é um atributo obrigatório'));
  test('Test 4.1.9 - Atualizar Serviço sem Id de equipamento', () => testTemplateAtualizar({ equipment_id: null }, 'O Id do equipamento é um atributo obrigatório'));
  test('Test 4.1.10 - Atualizar Serviço com estado inválido', () => testTemplateAtualizar({ status: null }, 'O estado é um atributo obrigatório'));
});

test('Test #5 - Remover serviço', () => {
  return app.db('services')
    .insert({ status: 'Pending', description: 'Delete Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id }, ['id'])
    .then((serv) => request(app).delete(`${MAIN_ROUTE}/${serv[0].id}`)
      .set('authorization', `bearer ${TOKEN}`)
      .send({ description: 'Delete Avaria na dobradiça' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
