module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('technicians').where(filter).select();
  };

  const save = async (technician) => {
    if (!technician.name) return { error: 'Nome é um atributo obrigatório' };
    if (!technician.email) return { error: 'O email é um atributo obrigatório' };
    if (!technician.password) return { error: 'A palavra-passe é um atributo obrigatório' };
    if (!technician.address) return { error: 'A morada é um atributo obrigatório' };
    if (!technician.BirhDate) return { error: 'A data de nascimento é um atributo obrigatório' };

    const technicianDb = await findAll({ email: technician.email });
    if (technicianDb && technicianDb.length > 0) return { error: 'Email duplicado na BD' };
    return app.db('technicians').insert(technician, '*');
  };

  return { findAll, save };
};
