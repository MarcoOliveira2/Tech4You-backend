const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const save = (equipment) => {
    if (!equipment.typeEquipment) throw new ValidationError('O tipo de equipamento é um atributo obrigatório');
    if (!equipment.serialNumber) throw new ValidationError('O número de série é um atributo obrigatório');
    if (!equipment.brand) throw new ValidationError('A marca do equipamento é um atributo obrigatório');
    if (!equipment.accessories) throw new ValidationError('Os acessórios são um atributo obrigatório');
    if (!equipment.damages) throw new ValidationError('Os danos do equipamento são um atributo obrigatório');
    if (!equipment.client_id) throw new ValidationError('O Id do cliente é um atributo obrigatório');

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
