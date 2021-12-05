module.exports = (app) => {
  const save = (equipment) => {
    return app.db('equipments').insert(equipment, '*');
  };

  const findAll = () => {
    return app.db('equipments');
  };

  const find = (filter = {}) => {
    return app.db('equipments').where(filter).first();
  };

  const update = (id, equipment) => {
    return app.db('equipments')
      .where({ id })
      .update(equipment, '*');
  };

  const remove = (id) => {
    return app.db('equipments')
      .where({ id })
      .del();
  };

  return { save, findAll, find, update, remove };
};
