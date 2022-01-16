const { Router } = require('express');
const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auths);

  const privateRouter = express.Router();
  const publicRouter = express.Router();

  privateRouter.use('/technicians', app.routes.technicians);
  privateRouter.use('/services', app.routes.services);
  privateRouter.use('/clients', app.routes.clients);
  privateRouter.use('/equipments', app.routes.equipments);

  publicRouter.use('/public/clients', app.routes.clients);
  publicRouter.use('/public/equipments', app.routes.equipments);
  publicRouter.use('/public/services', app.routes.services);

  app.use('/v1', app.config.passport.authenticate(), privateRouter);
  app.use('/public', publicRouter);
};
