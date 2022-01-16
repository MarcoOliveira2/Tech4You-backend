const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const find = (filter = {}) => {
    return app.db('services').where(filter).first();
  };

  const save = async (service) => {
    if (!service.status) throw new ValidationError('O estado é um atributo obrigatório');
    if (!service.description) throw new ValidationError('A descrição é um atributo obrigatório');
    if (!service.observations) throw new ValidationError('As observações são um atributo obrigatório');
    if (!service.startDate) throw new ValidationError('A data de inicio é um atributo obrigatório');
    if (!service.endDate) throw new ValidationError('A data estimada de finalização é um atributo obrigatório');
    if (!service.tests) throw new ValidationError('Os testes efetuados é um atributo obrigatório');
    if (!service.components) throw new ValidationError('Os componentes são um atributo obrigatório');
    if (!service.technician_id) throw new ValidationError('O Id do técnico responsável é um atributo obrigatório');
    if (!service.equipment_id) throw new ValidationError('O Id do equipamento é um atributo obrigatório');
    if (!(service.status === 'Ready' || service.status === 'Pending' || service.status === 'Cancelled')) throw new ValidationError('Tipo de estado inválido');

    return app.db('services').insert(service, '*');
  };

  const findAll = () => {
    return app.db('services');
  };

  const update = (id, service) => {
    if (!service.status) throw new ValidationError('O estado é um atributo obrigatório');
    if (!service.description) throw new ValidationError('A descrição é um atributo obrigatório');
    if (!service.observations) throw new ValidationError('As observações são um atributo obrigatório');
    if (!service.startDate) throw new ValidationError('A data de inicio é um atributo obrigatório');
    if (!service.endDate) throw new ValidationError('A data estimada de finalização é um atributo obrigatório');
    if (!service.tests) throw new ValidationError('Os testes efetuados é um atributo obrigatório');
    if (!service.components) throw new ValidationError('Os componentes são um atributo obrigatório');
    if (!service.technician_id) throw new ValidationError('O Id do técnico responsável é um atributo obrigatório');
    if (!service.equipment_id) throw new ValidationError('O Id do equipamento é um atributo obrigatório');
    if (!(service.status === 'Ready' || service.status === 'Pending' || service.status === 'Cancelled')) throw new ValidationError('Tipo de estado inválido');

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
