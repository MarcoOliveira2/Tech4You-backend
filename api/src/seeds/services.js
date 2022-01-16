exports.seed = (knex) => {
  return knex('services').del()
    .then(() => knex('equipments').del())
    .then(() => knex('clients').del())
    .then(() => knex('technicians').del())
    .then(() => knex('technicians').insert([
      {
        id: 10000, name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: '$2a$10$k7JP3zx/tuOEvhq5CPgMcediXLuRxTM/9EFfzm82qfa8gP3c9gchO', email: 'miguel@tech4you.pt',
      },
      {
        id: 10001, name: 'Marco Oliveira', address: 'Pedome', BirhDate: '29-05-2002', password: '$2a$10$k7JP3zx/tuOEvhq5CPgMcediXLuRxTM/9EFfzm82qfa8gP3c9gchO', email: 'marco@tech4you.pt',
      },
    ]))
    .then(() => knex('clients').insert([
      {
        id: 10000, name: 'Bruno Faria', address: 'Gerês', BirhDate: '29-05-1998', phoneNumber: '961548614', email: 'brunoFaria@planeta.com', nif: 45654325,
      },
      {
        id: 10001, name: 'Luis Leandro', address: 'Pevidem', BirhDate: '23-01-1994', phoneNumber: '917264832', email: 'luisLeandro@point.com', nif: 45344325,
      },
    ]))
    .then(() => knex('equipments').insert([
      {
        id: 10000, typeEquipment: 'Laptop', serialNumber: 43566323, brand: 'Apple', accessories: 'Charger', damages: 'Hinge damage', client_id: 10001,
      },
      {
        id: 10001, typeEquipment: 'Laptop', serialNumber: 24319134, brand: 'Apple', accessories: 'Charger', damages: 'keyboard', client_id: 10000,
      },
    ]))
    .then(() => knex('services').insert([
      {
        id: 10000, status: 'Pending', description: 'Avaria na dobradiça', observations: 'Partido', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste a dobradiça', components: 'Dobradiça nova', technician_id: 10000, equipment_id: 10000,
      },
      {
        id: 10001, status: 'Pending', description: 'Avaria no teclado', observations: 'Tecla Partida', startDate: '29-05-2002', endDate: '30-06-2003', tests: 'Teste ao teclado', components: 'Teclado novo', technician_id: 10001, equipment_id: 10001,
      },
    ]));
};
