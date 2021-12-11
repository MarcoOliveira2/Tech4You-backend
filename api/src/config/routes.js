module.exports = (app) => {
  app.route('/auth/signin').post(app.routes.auths.signin);
  app.route('/auth/signup').post(app.routes.technicians.create);

  app.route('/technicians')
    .all(app.config.passport.authenticate())
    .get(app.routes.technicians.findAll)
    .post(app.routes.technicians.create);

  app.route('/technicians/:id')
    .get(app.routes.technicians.get)
    .put(app.routes.technicians.update)
    .delete(app.routes.technicians.remove);

  app.route('/clients')
    .get(app.routes.clients.findAll)
    .post(app.routes.clients.create);

  app.route('/clients/:id')
    .get(app.routes.clients.get)
    .put(app.routes.clients.update)
    .delete(app.routes.clients.remove);

  app.route('/accounts')
    .all(app.config.passport.authenticate())
    .get(app.routes.accounts.getAll)
    .post(app.routes.accounts.create);

  app.route('/accounts/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.accounts.get)
    .put(app.routes.accounts.update)
    .delete(app.routes.accounts.remove);

  app.route('/equipments')
    .get(app.routes.equipments.getAll)
    .post(app.routes.equipments.create);

  app.route('/equipments/:id')
    .get(app.routes.equipments.get)
    .put(app.routes.equipments.update)
    .delete(app.routes.equipments.remove);

  app.route('/services')
    .get(app.routes.services.getAll)
    .post(app.routes.services.create);

  app.route('/services/:id')
    .get(app.routes.services.get)
    .put(app.routes.services.update)
    .delete(app.routes.services.remove);
};
