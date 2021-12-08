const request = require('supertest');

const app = require('../../src/app');

const MAIN_ROUTE = '/technicians';

const mail = `${Date.now()}@ipca.pt`;

test('Test #1 - Listar os Técnicos', () => {
  return request(app).get('/technicians')
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - Inserir Técnicos', () => {
  return request(app).post('/technicians')
    .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: mail })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Miguel Pinto');
    });
});

test('Test #3 - Inserir tecnico sem nome', () => {
  return request(app).post('/technicians')
    .send({ address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: mail })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Nome é um atributo obrigatório');
    });
});

test('Test #4 - Inserir tecnico sem email', async () => {
  const result = await request(app).post('/technicians')
    .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin' });
  expect(result.status).toBe(400);
  expect(result.body.error).toBe('O email é um atributo obrigatório');
});

test('Test #5 - Inserir técnico sem password', (done) => {
  request(app).post('/technicians')
    .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', email: mail })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A palavra-passe é um atributo obrigatório');
      done();
    });
});

test('Test #6 - Inserir tecnico com email duplicado', () => {
  request(app).post('/technicians')
    .send({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: mail })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Email duplicado na BD');
    });
});

test('Test #7 - Inserir tecnico sem morada', () => {
  return request(app).post('/technicians')
    .send({ name: 'Miguel Pinto', BirhDate: '16-03-2001', password: 'admin', email: mail })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A morada é um atributo obrigatório');
    });
});

test('Test #8 - Inserir tecnico sem data de nascimento', () => {
  return request(app).post('/technicians')
    .send({ name: 'Miguel Pinto', address: 'Viatodos', password: 'admin', email: mail })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('A data de nascimento é um atributo obrigatório');
    });
});

test('Test #9 - Listar técnico por ID', () => {
  return app.db('technicians')
    .insert({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` }, ['id'])
    .then((tech) => request(app).get(`${MAIN_ROUTE}/${tech[0].id}`))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Miguel Pinto');
    });
});

test('Test #10 - Atualizar técnico', () => {
  return app.db('technicians')
    .insert({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` }, ['id'])
    .then((tech) => request(app).put(`${MAIN_ROUTE}/${tech[0].id}`)
      .send({ name: 'Nome atualizado' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.name).toBe('Nome atualizado');
    });
});

test('Test #11 - Remover técnico', () => {
  return app.db('technicians')
    .insert({ name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: `${Date.now()}@ipca.pt` }, ['id'])
    .then((tech) => request(app).delete(`${MAIN_ROUTE}/${tech[0].id}`)
      .send({ name: 'Miguel Pinto' }))
    .then((res) => {
      expect(res.status).toBe(204);
    });
});
