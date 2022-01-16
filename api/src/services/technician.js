const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('technicians').where(filter).select(['id', 'name', 'email', 'address', 'BirhDate']);
  };

  const find = (filter = {}) => {
    return app.db('technicians').where(filter).first();
  };

  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const save = async (technician) => {
    if (!technician.name) throw new ValidationError('O Nome é um atributo obrigatório');
    if (!technician.email) throw new ValidationError('O email é um atributo obrigatório');
    if (!technician.password) throw new ValidationError('A palavra-passe é um atributo obrigatório');
    if (!technician.address) throw new ValidationError('A morada é um atributo obrigatório');
    if (!technician.BirhDate) throw new ValidationError('A data de nascimento é um atributo obrigatório');

    const technicianDb = await find({ email: technician.email });
    if (technicianDb) throw new ValidationError('Email duplicado na BD');

    const newTechnician = { ...technician };
    newTechnician.password = getPasswordHash(technician.password);
    return app.db('technicians').insert(newTechnician, ['id', 'name', 'email', 'address', 'BirhDate']);
  };

  const update = async (id, technician) => {
    if (!technician.name) throw new ValidationError('O Nome é um atributo obrigatório');
    if (!technician.email) throw new ValidationError('O email é um atributo obrigatório');
    if (!technician.password) throw new ValidationError('A palavra-passe é um atributo obrigatório');
    if (!technician.address) throw new ValidationError('A morada é um atributo obrigatório');
    if (!technician.BirhDate) throw new ValidationError('A data de nascimento é um atributo obrigatório');

    return app.db('technicians')
      .where({ id })
      .update(technician, '*');
  };

  const remove = (id) => {
    return app.db('technicians')
      .where({ id })
      .del();
  };

  return { findAll, save, find, update, remove, getPasswordHash };
};
