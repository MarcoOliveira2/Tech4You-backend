const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('clients').where(filter).select();
  };

  const save = async (client) => {
    if (!client.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!client.address) throw new ValidationError('A morada é um atributo obrigatório');
    if (!client.BirhDate) throw new ValidationError('A data de nascimento é um atributo obrigatório');
    if (!client.phoneNumber) throw new ValidationError('O numero de telémovel é um atributo obrigatório');
    if (!client.email) throw new ValidationError('O email é um atributo obrigatório');
    if (!client.nif) throw new ValidationError('O NIF é um atributo obrigatório');

    const clientDbemail = await findAll({ email: client.email });
    if (clientDbemail && clientDbemail.length > 0) throw new ValidationError('Email duplicado na BD');

    const clientDbnif = await findAll({ nif: client.nif });
    if (clientDbnif && clientDbnif.length > 0) throw new ValidationError('Nif duplicado na BD');

    return app.db('clients').insert(client, '*');
  };

  const find = (filter = {}) => {
    return app.db('clients').where(filter).first();
  };

  const update = (id, client) => {
    return app.db('clients')
      .where({ id })
      .update(client, '*');
  };

  const remove = (id) => {
    return app.db('clients')
      .where({ id })
      .del();
  };

  return { findAll, save, find, update, remove };
};
