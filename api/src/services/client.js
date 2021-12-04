module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('clients').where(filter).select();
  };

  const save = async (client) => {
    if (!client.name) return { error: 'Nome é um atributo obrigatório' };
    if (!client.address) return { error: 'A morada é um atributo obrigatório' };
    if (!client.BirhDate) return { error: 'A data de nascimento é um atributo obrigatório' };
    if (!client.phoneNumber) return { error: 'O numero de telémovel é um atributo obrigatório' };
    if (!client.email) return { error: 'O email é um atributo obrigatório' };
    if (!client.nif) return { error: 'O NIF é um atributo obrigatório' };

    const clientDb = await findAll({ email: client.email });
    if (clientDb && clientDb.length > 0) return { error: 'Email duplicado na BD' };
    return app.db('clients').insert(client, '*');
  };

  return { findAll, save };
};
