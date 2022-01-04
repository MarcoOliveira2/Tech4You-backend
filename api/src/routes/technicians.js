const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.technician.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.technician.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.get('/:id', (req, res, next) => {
    app.services.technician.find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.technician.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.delete('/:id', (req, res, next) => {
    app.services.technician.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
