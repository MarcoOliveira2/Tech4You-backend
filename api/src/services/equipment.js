const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('equipments').where(filter).select();
  };

  const find = (filter = {}) => {
    return app.db('equipments').where(filter).first();
  };

  const a = 1234;
  const save = async (equipment) => {
    if (!equipment.typeEquipment) throw new ValidationError('O tipo de equipamento é um atributo obrigatório');
    if (!equipment.serialNumber) throw new ValidationError('O número de série é um atributo obrigatório');
    if (!equipment.brand) throw new ValidationError('A marca do equipamento é um atributo obrigatório');
    if (!equipment.accessories) throw new ValidationError('Os acessórios são um atributo obrigatório');
    if (!equipment.damages) throw new ValidationError('Os danos do equipamento são um atributo obrigatório');
    if (!equipment.client_id) throw new ValidationError('O Id do cliente é um atributo obrigatório');
    if (!(equipment.typeEquipment === 'Desktop' || equipment.typeEquipment === 'Laptop' || equipment.typeEquipment === 'Tablet' || equipment.typeEquipment === 'Phone' || equipment.typeEquipment === 'Printer' || equipment.typeEquipment === 'Monitor' || equipment.typeEquipment === 'Other')) throw new ValidationError('Tipo de equipamento inválido');

    const equipmentSerialNumber = await find({ serialNumber: equipment.serialNumber });
    if (equipmentSerialNumber) throw new ValidationError('Número de Série duplicado na BD');

    return app.db('equipments').insert(equipment, '*');
  };

  const update = async (id, equipment) => {
    if (!equipment.typeEquipment) throw new ValidationError('O tipo de equipamento é um atributo obrigatório');
    if (!equipment.serialNumber) throw new ValidationError('O número de série é um atributo obrigatório');
    if (!equipment.brand) throw new ValidationError('A marca do equipamento é um atributo obrigatório');
    if (!equipment.accessories) throw new ValidationError('Os acessórios são um atributo obrigatório');
    if (!equipment.damages) throw new ValidationError('Os danos do equipamento são um atributo obrigatório');
    if (!equipment.client_id) throw new ValidationError('O Id do cliente é um atributo obrigatório');
    if (!(equipment.typeEquipment === 'Desktop' || equipment.typeEquipment === 'Laptop' || equipment.typeEquipment === 'Tablet' || equipment.typeEquipment === 'Phone' || equipment.typeEquipment === 'Printer' || equipment.typeEquipment === 'Monitor' || equipment.typeEquipment === 'Other')) throw new ValidationError('Tipo de equipamento inválido');

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
