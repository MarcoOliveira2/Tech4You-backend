const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const save = async (account) => {
    if (!account.name) throw new ValidationError('Nome é um atributo obrigatório');
    return app.db('accounts').insert(account, '*');
  };

  const findAll = (technicianId) => {
    return app.db('accounts').where({ technician_id: technicianId });
  };

  const find = (filter = {}) => {
    return app.db('accounts').where(filter).first();
  };

  const update = (id, account) => {
    return app.db('accounts')
      .where({ id })
      .update(account, '*');
  };

  const remove = (id) => {
    return app.db('accounts')
      .where({ id })
      .del();
  };

  return { save, findAll, find, update, remove };
};
