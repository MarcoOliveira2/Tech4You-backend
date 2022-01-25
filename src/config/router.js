const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auths);

  const privateRouter = express.Router();
  const publicRouter = express.Router();

  privateRouter.use('/technicians', app.routes.technicians);
  privateRouter.use('/services', app.routes.services);
  privateRouter.use('/clients', app.routes.clients);
  privateRouter.use('/equipments', app.routes.equipments);

  publicRouter.use('/publicClients', app.routes.publicClients);
  publicRouter.use('/publicServices', app.routes.publicServices);
  publicRouter.use('/publicEquipamentos', app.routes.publicEquipamentos);

  app.use('/v1', app.config.passport.authenticate(), privateRouter);
  app.use('/public', publicRouter);
};
