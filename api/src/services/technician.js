module.exports = (app) => {
  const findAll = () => {
    return app.db('technicians').select();
  };

  const save = (technician) => {
    if (!technician.name) return { error: 'Nome é um atributo obrigatório' };
    if (!technician.email) return { error: 'O email é um atributo obrigatório' };
    if (!technician.password) return { error: 'A palavra-passe é um atributo obrigatório' };
    return app.db('technicians').insert(technician, '*');
  };

  return { findAll, save };
};
