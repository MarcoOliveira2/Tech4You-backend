const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/public/publicEquipamentos';

const client = {
  id: 10000, name: 'Bruno Faria', address: 'Gerês', BirhDate: '29-05-1998', phoneNumber: '961548614', email: 'brunoFaria@planeta.com', nif: 45654325,
};

test('Test #3 - Listar equipamento por ID', () => {
  function getRandomSerialNumber() {
    return Math.floor(Math.random() * 88888888) + 1;
  }
  const serialNumberEquipment = `${getRandomSerialNumber()}`;
  return app.db('equipments')
    .insert({
      typeEquipment: 'Laptop', serialNumber: serialNumberEquipment, brand: 'ACER', accessories: 'Charger', damages: 'Hinge damage', client_id: client.id,
    }, ['id'])
    .then((equip) => request(app).get(`${MAIN_ROUTE}/${equip[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.typeEquipment).toBe('Laptop');
      expect(res.body.client_id).toBe(client.id);
    });
});
