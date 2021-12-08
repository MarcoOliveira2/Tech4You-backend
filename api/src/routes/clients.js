module.exports = (app) => {
  const findAll = (req, res, next) => {
    app.services.client.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const create = async (req, res, next) => {
    try {
      const result = await app.services.client.save(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  };

  const get = (req, res, next) => {
    app.services.client.find({ id: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  };

  const update = (req, res, next) => {
    app.services.client.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  };

  const remove = (req, res, next) => {
    app.services.client.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  };

  return { findAll, create, get, update, remove };
};
