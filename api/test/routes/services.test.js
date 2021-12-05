// test('Teste #1 - Inserir serviço', () => {
//   return request(app).post(MAIN_ROUTE)
//     .set('authorization', `bearer ${technician.token}`)
//     .send({ CAMPOS DO SERVIÇO, technician_id: technician.id, equipment_id: equipment.id })
//     .then((res) => {
//       expect(res.status).toBe(201);
//       expect(res.body.name).toBe(CAMPOS DO SERVIÇO);
//     });
// });

// test('Test #2 - Listar serviços', () => {
//   return app.db('services')
//     .insert({ CAMPOS DO SERVIÇO, technician_id: technician.id, equipment_id: equipment.id })
//     .then(() => request(app).get(MAIN_ROUTE))
//     .set('authorization', `bearer ${technician.token}`)
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.length).toBeGreaterThan(0);
//     });
// });

// test('Test #3 - Listar serviços por ID', () => {
//   return app.db('services')
//     .insert({ CAMPOS DO SERVIÇO, technician_id: technician.id, equipment_id: equipment.id }, ['id'])
//     .then((serv) => request(app).get(`${MAIN_ROUTE}/${serv[0].id}`))
//     .set('authorization', `bearer ${technician.token}`)
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.name).toBe(CAMPOS DO SERVIÇO);
//       expect(res.body.technician_id).toBe(technician.id);
//     });
// });

// test('Test #4 - Atualizar serviços', () => {
//   return app.db('services')
//     .insert({ CAMPOS DO SERVIÇO, technician_id: technician.id, equipment_id: equipment.id }, ['id'])
//     .then((serv) => request(app).put(`${MAIN_ROUTE}/${serv[0].id}`)
//     .set('authorization', `bearer ${technician.token}`)
//       .send({ CAMPOS DO SERVIÇO }))
//     .then((res) => {
//       expect(res.status).toBe(200);
//       expect(res.body.name).toBe(CAMPOS DO SERVIÇO);
//     });
// });

// test('Test #5 - Remover serviços', () => {
//   return app.db('services')
//     .insert({ CAMPOS DO SERVIÇO, technician_id: technician.id, equipment_id: equipment.id }, ['id'])
//     .then((acc) => request(app).delete(`${MAIN_ROUTE}/${acc[0].id}`)
//     .set('authorization', `bearer ${technician.token}`)
//       .send({ CAMPOS DO SERVIÇO }))
//     .then((res) => {
//       expect(res.status).toBe(204);
//     });
// });
