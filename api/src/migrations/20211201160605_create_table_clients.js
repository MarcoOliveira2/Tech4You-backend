exports.up = (knex) => {
  return knex.schema.createTable('clients', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('address').notNull();
    t.date('BirhDate').notNull();
    t.integer('phoneNumber').notNull();
    t.string('email').notNull().unique();
    t.integer('nif').notNull().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('clients');
};
