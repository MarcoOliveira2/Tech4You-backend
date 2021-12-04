exports.up = (knex) => {
  return knex.schema.createTable('accounts', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.integer('technician_id')
      .references('id')
      .inTable('technicians')
      .notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('accounts');
};
