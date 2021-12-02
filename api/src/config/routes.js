module.exports = (app) => {
  app.route('/technicians')
    .get(app.routes.technicians.findAll)
    .post(app.routes.technicians.create);
};
