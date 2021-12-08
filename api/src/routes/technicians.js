module.exports = (app) => {
  const findAll = (req, res, next) => {
    app.services.technician.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      const result = await app.services.technician.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  };

  const get = (req, res, next) => {
    app.services.technician.find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const update = (req, res, next) => {
    app.services.technician.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  };

  const remove = (req, res, next) => {
    app.services.technician.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  };
  return { findAll, create, get, update, remove };
};
