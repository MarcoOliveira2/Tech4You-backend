module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('equipments').where(filter).first();
  };

  return {
    find,
  };
};
