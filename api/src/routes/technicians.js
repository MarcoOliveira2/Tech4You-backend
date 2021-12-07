module.exports = (app) => {
  const findAll = (req, res) => {
    app.services.technician.findAll()
      .then((result) => res.status(200).json(result));
  };

  const create = async (req, res) => {
    const result = await app.services.technician.save(req.body);
    if (result.error) return res.status(400).json(result);
    res.status(201).json(result[0]);
  };

  const get = (req, res) => {
    app.services.technician.find({ id: req.params.id })
      .then((result) => res.status(200).json(result));
  };

  const update = (req, res) => {
    app.services.technician.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]));
  };
  return { findAll, create, get, update };
};
