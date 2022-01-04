const { Router } = require('express');
const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auths);

  const privateRouter = express.Router();
  const publicRouter = express.Router();

  privateRouter.use('/technicians', app.routes.technicians);
  privateRouter.use('/accounts', app.routes.accounts);
  publicRouter.use('/services', app.routes.services);
  publicRouter.use('/clients', app.routes.clients);
  publicRouter.use('/equipments', app.routes.equipments);

  app.use('/v1', app.config.passport.authenticate(), privateRouter);
  app.use('/public', publicRouter);
};
