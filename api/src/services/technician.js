const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('technicians').where(filter).select();
  };

  const save = async (technician) => {
    if (!technician.name) throw new ValidationError('Nome é um atributo obrigatório');
    if (!technician.email) throw new ValidationError('O email é um atributo obrigatório');
    if (!technician.password) throw new ValidationError('A palavra-passe é um atributo obrigatório');
    if (!technician.address) throw new ValidationError('A morada é um atributo obrigatório');
    if (!technician.BirhDate) throw new ValidationError('A data de nascimento é um atributo obrigatório');

    const technicianDb = await findAll({ email: technician.email });
    if (technicianDb && technicianDb.length > 0) throw new ValidationError('Email duplicado na BD');
    return app.db('technicians').insert(technician, '*');
  };

  const find = (filter = {}) => {
    return app.db('technicians').where(filter).first();
  };

  const update = (id, technician) => {
    return app.db('technicians')
      .where({ id })
      .update(technician, '*');
  };

  const remove = (id) => {
    return app.db('technicians')
      .where({ id })
      .del();
  };

  return { findAll, save, find, update, remove };
};
