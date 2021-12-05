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

  app.route('/equipments')
    .get(app.routes.equipments.getAll)
    .post(app.routes.equipments.create);

  // app.route('/equipments/:id')
  //   .get(app.routes.equipments.get)
  //   .put(app.routes.equipments.update)
  //   .delete(app.routes.equipments.remove);
};
