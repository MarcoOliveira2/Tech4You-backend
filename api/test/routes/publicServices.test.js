const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/public/publicServices';

const technician = {
  id: 10000, name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '$2a$10$k7JP3zx/tuOEvhq5CPgMcediXLuRxTM/9EFfzm82qfa8gP3c9gchO', email: 'miguel@tech4you.pt',
};
const equipment = {
  id: 10000, typeEquipment: 'Laptop', serialNumber: 43566323, brand: 'Apple', accessories: 'Charger', damages: 'Hinge damage', client_id: 10001,
};

test('Test #3 - Listar serviço por ID', () => {
  return app.db('services')
    .insert({
      status: 'Pending', description: 'Listar ID Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: technician.id, equipment_id: equipment.id,
    }, ['id'])
    .then((serv) => request(app).get(`${MAIN_ROUTE}/${serv[0].id}`))

    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.description).toBe('Listar ID Avaria na dobradiça');
      expect(res.body.technician_id).toBe(technician.id);
      expect(res.body.equipment_id).toBe(equipment.id);
    });
});
