const request = require('supertest');
const jwt = require('jwt-simple');

const app = require('../../src/app');

const secret = 'APIMARCOPINTO';

function getRandomNif() {
  return Math.floor(Math.random() * 99999999) + 1;
}

const MAIN_ROUTE = '/v1/equipments';
let client;
let technician;
const mailclient = `${Date.now()}@cliente.pt`;
const nifclient = `${getRandomNif()}`;

function getRandomSerialNumber1() {
  return Math.floor(Math.random() * 88888888) + 1;
}
const serialNumberEquipment1 = `${getRandomSerialNumber1()}`;

beforeAll(async () => {
  const res = await app.services.technician.save({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '12345', email: `${Date.now()}@ipca.pt` });
  technician = { ...res[0] };
  technician.token = jwt.encode(technician, secret);

  const res1 = await app.services.client.save({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient });
  client = { ...res1[0] };
});

test('Test #1 - Inserir Equipamento', () => {
  return request(app).post(MAIN_ROUTE).set('authorization', `bearer ${technician.token}`)
    .send({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment1, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.typeEquipment).toBe('Laptop');
    });
});

describe('Test #1.1 - Inserir Equipamento', () => {
  const testTemplateInserir = (newData, errorMessage) => {
    return request(app).post(MAIN_ROUTE)
      .set('authorization', `bearer ${technician.token}`)
      .send({ typeEquipment: 'Laptop', serialNumber: `${Math.floor(Math.random() * 88888888) + 1}`, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id, ...newData })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Test 1.1.1 - Inserir Equipamento com tipo inválido', () => testTemplateInserir({ typeEquipment: 'Errado' }, 'Tipo de equipamento inválido'));
  test('Test 1.1.2 - Inserir Equipamento com número de série duplicado', () => testTemplateInserir({ serialNumber: serialNumberEquipment1 }, 'Número de Série duplicado na BD'));
  test('Test 1.1.3 - Inserir Equipamento sem tipo de equipamento', () => testTemplateInserir({ typeEquipment: null }, 'O tipo de equipamento é um atributo obrigatório'));
  test('Test 1.1.4 - Inserir Equipamento sem número de série', () => testTemplateInserir({ serialNumber: null }, 'O número de série é um atributo obrigatório'));
  test('Test 1.1.5 - Inserir Equipamento sem acessórios', () => testTemplateInserir({ accessories: null }, 'Os acessórios são um atributo obrigatório'));
  test('Test 1.1.6 - Inserir Equipamento sem danos', () => testTemplateInserir({ damages: null }, 'Os danos do equipamento são um atributo obrigatório'));
  test('Test 1.1.7 - Inserir Equipamento sem Id de cliente', () => testTemplateInserir({ client_id: null }, 'O Id do cliente é um atributo obrigatório'));
  test('Test 1.1.8 - Inserir Equipamento sem marca', () => testTemplateInserir({ brand: null }, 'A marca do equipamento é um atributo obrigatório'));
});

test('Test #2 - Listar Equipamentos', () => {
  return request(app).get(MAIN_ROUTE)
    .set('authorization', `bearer ${technician.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #3 - Listar equipamento por ID', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return app.db('equipments')
    .insert({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id }, ['id'])
    .then((equip) => request(app).get(`${MAIN_ROUTE}/${equip[0].id}`).set('authorization', `bearer ${technician.token}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.typeEquipment).toBe('Laptop');
      expect(res.body.client_id).toBe(client.id);
    });
});

test('Test #4 - Atualizar equipamento', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return app.db('equipments')
    .insert({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id }, ['id'])
    .then((equip) => request(app).put(`${MAIN_ROUTE}/${equip[0].id}`).set('authorization', `bearer ${technician.token}`)
      .send({ typeEquipment: 'Desktop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.typeEquipment).toBe('Desktop');
    });
});

describe('Test #4.1 - Atualizar Equipamento', () => {
  const testTemplateAtualizar = (newData, errorMessage) => {
    return app.db('equipments')
      .insert({ typeEquipment: 'Laptop', serialNumber: `${Math.floor(Math.random() * 88888888) + 1}`, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id }, ['id'])
      .then((equip) => request(app).put(`${MAIN_ROUTE}/${equip[0].id}`).set('authorization', `bearer ${technician.token}`)
        .send({ typeEquipment: 'Desktop', serialNumber: `${Math.floor(Math.random() * 88888888) + 1}`, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id, ...newData }))
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test 4.1.1 - Inserir Equipamento com tipo inválido', () => testTemplateAtualizar({ typeEquipment: 'Errado' }, 'Tipo de equipamento inválido'));
  test('Test 4.1.2 - Inserir Equipamento sem tipo de equipamento', () => testTemplateAtualizar({ typeEquipment: null }, 'O tipo de equipamento é um atributo obrigatório'));
  test('Test 4.1.3 - Inserir Equipamento sem número de série', () => testTemplateAtualizar({ serialNumber: null }, 'O número de série é um atributo obrigatório'));
  test('Test 4.1.4 - Inserir Equipamento sem acessórios', () => testTemplateAtualizar({ accessories: null }, 'Os acessórios são um atributo obrigatório'));
  test('Test 4.1.5 - Inserir Equipamento sem danos', () => testTemplateAtualizar({ damages: null }, 'Os danos do equipamento são um atributo obrigatório'));
  test('Test 4.1.6 - Inserir Equipamento sem Id de cliente', () => testTemplateAtualizar({ client_id: null }, 'O Id do cliente é um atributo obrigatório'));
  test('Test 4.1.7 - Inserir Equipamento sem marca', () => testTemplateAtualizar({ brand: null }, 'A marca do equipamento é um atributo obrigatório'));
});

test('Test #5 - Remover equipamento', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return app.db('equipments')
    .insert({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id }, ['id'])
    .then((equip) => request(app).delete(`${MAIN_ROUTE}/${equip[0].id}`).set('authorization', `bearer ${technician.token}`)
      .send({ typeEquipment: 'Laptop' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
