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

beforeAll(async () => {
  const res = await app.services.technician.save({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '12345', email: `${Date.now()}@ipca.pt` });
  technician = { ...res[0] };
  technician.token = jwt.encode(technician, secret);

  const res1 = await app.services.client.save({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient });
  client = { ...res1[0] };
});

test('Test #1 - Inserir Equipamento', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return request(app).post(MAIN_ROUTE).set('authorization', `bearer ${technician.token}`)
    .send({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.typeEquipment).toBe('Laptop');
    });
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
    .then((equip) => request(app).delete(`${MAIN_ROUTE}/${equip[0].id}`).set('authorization', `bearer ${technician.token}`)
      .send({ typeEquipment: 'Laptop' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
