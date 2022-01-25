exports.up = (knex) => {
  return knex.schema.createTable('services', (t) => {
    t.increments('id').primary();
    t.enu('status', ['Ready', 'Pending', 'Cancelled']).notNull();
    t.string('description').notNull();
    t.string('observations').notNull();
    t.date('startDate').notNull();
    t.date('endDate').notNull();
    t.string('tests').notNull();
    t.string('components').notNull();
    t.integer('technician_id')
      .references('id')
      .inTable('technicians')
      .notNull();
    t.integer('equipment_id')
      .references('id')
      .inTable('equipments')
      .notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('services');
};
