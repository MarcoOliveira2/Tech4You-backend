const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/:id', (req, res, next) => {
    app.services.publicEquipamento.find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  return router;
};
