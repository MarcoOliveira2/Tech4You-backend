module.exports = (app) => {
  const create = (req, res, next) => {
    app.services.service.save(req.body)
      .then((result) => {
        return res.status(201).json(result[0]);
      }).catch((err) => {
        next(err);
      });
  };

  const getAll = (req, res, next) => {
    app.services.service.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const get = (req, res, next) => {
    app.services.service.find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const update = (req, res, next) => {
    app.services.service.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  };

  const remove = (req, res, next) => {
    app.services.service.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  };

  return { create, getAll, get, update, remove };
};
