const request = require('supertest');
const app = require('../../src/app');

const mail = `${Date.now()}@ipca.pt`;

test('Test #1 - Receber token ao autenticar', () => {
  return app.services.technician.save({
    name: 'Miguel Auth', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: mail,
  })
    .then(() => request(app).post('/auth/signin')
      .send({ email: mail, password: 'admin' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Test #2 - Tentativa de autenticação errada', () => {
  const nmail = `${Date.now()}@ipca.pt`;
  return app.services.technician.save({
    name: 'Miguel Pinto', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: nmail,
  })
    .then(() => request(app).post('/auth/signin')
      .send({ email: nmail, password: '12345' }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação inválida!');
    });
});

test('Test #3 - Tentativa de autenticação com técnico errado', () => {
  const nmail = `${Date.now()}@ipca.pt`;
  return request(app).post('/auth/signin')
    .send({ email: nmail, password: '12345' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação inválida! #2');
    });
});

test('Test #4 - Aceder a rotas protegidas', () => {
  return request(app).get('/v1/technicians')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});

test('Test #5 - Criar técnico', () => {
  const nmail = `${Date.now()}@ipca.pt`;
  return request(app).post('/auth/signup')
    .send({
      name: 'Miguel Signup', address: 'Viatodos', BirhDate: '16-03-2001', password: 'admin', email: nmail,
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.name).toBe('Miguel Signup');
      expect(res.body).toHaveProperty('email');
      expect(res.body).not.toHaveProperty('password');
    });
});
