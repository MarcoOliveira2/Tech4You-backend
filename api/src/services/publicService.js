module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('services').where(filter).first();
  };

  return {
    find,
  };
};
