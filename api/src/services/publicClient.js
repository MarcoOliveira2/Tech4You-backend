module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('clients').where(filter).first();
  };

  return {
    find,
  };
};
