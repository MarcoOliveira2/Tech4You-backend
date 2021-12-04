module.exports = (app) => {
  app.route('/technicians')
    .get(app.routes.technicians.findAll)
    .post(app.routes.technicians.create);

  app.route('/technicians/:id')
    .get(app.routes.technicians.findAll);

  app.route('/clients')
    .get(app.routes.clients.findAll)
    .post(app.routes.clients.create);

  app.route('/accounts')
    .get(app.routes.accounts.getAll)
    .post(app.routes.accounts.create);

  app.route('/accounts/:id')
    .get(app.routes.accounts.get)
    .put(app.routes.accounts.update)
    .delete(app.routes.accounts.remove);
};
