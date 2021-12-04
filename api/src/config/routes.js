module.exports = (app) => {
  app.route('/technicians')
    .get(app.routes.technicians.findAll)
    .post(app.routes.technicians.create);

  app.route('/clients')
    .get(app.routes.clients.findAll)
    .post(app.routes.clients.create);
};
