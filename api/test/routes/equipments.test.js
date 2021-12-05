const request = require('supertest');

const app = require('../../src/app');

function getRandomNif() {
  return Math.floor(Math.random() * 99999999) + 1;
}

function getRandomSerialNumber() {
  return Math.floor(Math.random() * 88888888) + 1;
}

function getRandomSerialNumber2() {
  return Math.floor(Math.random() * 88888888) + 1;
}

const MAIN_ROUTE = '/equipments';
let client;
const mailclient = `${Date.now()}@cliente.pt`;
const nifclient = `${getRandomNif()}`;
const serialNumberEquipment = `${getRandomSerialNumber()}`;
const serialNumberEquipment2 = `${getRandomSerialNumber2()}`;

beforeAll(async () => {
  const res = await app.services.client.save({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient });
  client = { ...res[0] };
});

test('Teste #7 - Inserir Equipamento', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.typeEquipment).toBe('Laptop');
    });
});

test('Test #8 - Listar Equipamentos', () => {
  return app.db('equipments')
    .insert({ typeEquipment: 'Other', serialNumber: serialNumberEquipment2, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});
