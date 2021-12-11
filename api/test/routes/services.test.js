const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');

const secret = 'APIMARCOPINTO';
const MAIN_ROUTE = '/services';
let equipment;
let technician;
let client;

function getRandomNif() {
  return Math.floor(Math.random() * 99999999) + 1;
}

const mailclient = `${Date.now()}@cliente.pt`;
const nifclient = `${getRandomNif()}`;

function getRandomSerialNumber() {
  return Math.floor(Math.random() * 88888888) + 1;
}
const serialNumberEquipment = `${getRandomSerialNumber()}`;

beforeAll(async () => {
  const res = await app.services.technician.save({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '12345', email: `${Date.now()}@ipca.pt` });
  technician = { ...res[0] };
  technician.token = jwt.encode(technician, secret);

  const res2 = await app.services.client.save({ name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', phoneNumber: '961548614', email: mailclient, nif: nifclient });
  client = { ...res2[0] };

  const res1 = await app.services.equipment.save({ typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id });
  equipment = { ...res1[0] };
});

test('Test #1 - Inserir Serviço', () => {
  return request(app).post(MAIN_ROUTE)
    .send({ status: 'Pending', description: 'Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.description).toBe('Avaria na dobradiça');
    });
});

test('Test #2 - Listar Serviços', () => {
  return app.db('services')
    .insert({ status: 'Pending', description: 'Listar Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id })
    .then(() => request(app).get(MAIN_ROUTE))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #3 - Listar serviço por ID', () => {
  return app.db('services')
    .insert({ status: 'Pending', description: 'Listar ID Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id }, ['id'])
    .then((serv) => request(app).get(`${MAIN_ROUTE}/${serv[0].id}`))
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
      .send({ description: 'UPDATE Avaria na dobradiça' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.description).toBe('UPDATE Avaria na dobradiça');
    });
});

test('Test #5 - Remover serviço', () => {
  return app.db('services')
    .insert({ status: 'Pending', description: 'Delete Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id }, ['id'])
    .then((serv) => request(app).delete(`${MAIN_ROUTE}/${serv[0].id}`)
      .send({ description: 'Delete Avaria na dobradiça' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
