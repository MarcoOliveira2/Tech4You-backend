const request = require('supertest');

const app = require('../../src/app');

function getRandomNif() {
  return Math.floor(Math.random() * 99999999) + 1;
}

const MAIN_ROUTE = '/equipments';
let client;
const mailclient = `${Date.now()}@cliente.pt`;
const nifclient = `${getRandomNif()}`;

beforeAll(async () => {
  const res = await app.services.client.save({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient });
  client = { ...res[0] };
});

test('Test #1 - Inserir Equipamento', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return request(app).post(MAIN_ROUTE)
    .send({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.typeEquipment).toBe('Laptop');
    });
});

test('Test #2 - Listar Equipamentos', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return app.db('equipments')
    .insert({ typeEquipment: 'Other', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id })
    .then(() => request(app).get(MAIN_ROUTE))
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
    .then((equip) => request(app).get(`${MAIN_ROUTE}/${equip[0].id}`))
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
    .then((equip) => request(app).put(`${MAIN_ROUTE}/${equip[0].id}`)
      .send({ typeEquipment: 'Laptop' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.typeEquipment).toBe('Laptop');
    });
});

test('Test #5 - Remover equipamento', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return app.db('equipments')
    .insert({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id }, ['id'])
    .then((equip) => request(app).delete(`${MAIN_ROUTE}/${equip[0].id}`)
      .send({ typeEquipment: 'Laptop' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
