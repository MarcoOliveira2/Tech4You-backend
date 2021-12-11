module.exports = (app) => {
  const save = (service) => {
    return app.db('services').insert(service, '*');
  };

  const findAll = () => {
    return app.db('services');
  };

  const find = (filter = {}) => {
    return app.db('services').where(filter).first();
  };

  const update = (id, service) => {
    return app.db('services')
      .where({ id })
      .update(service, '*');
  };

  const remove = (id) => {
    return app.db('services')
      .where({ id })
      .del();
  };

  return { save, findAll, find, update, remove };
};
