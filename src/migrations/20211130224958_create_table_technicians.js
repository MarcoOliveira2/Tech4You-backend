exports.up = (knex) => {
  return knex.schema.createTable('technicians', (t) => {
    t.increments('id').primary();
    t.string('name').notNull();
    t.string('address').notNull();
    t.date('BirhDate').notNull();
    t.string('password').notNull();
    t.string('email').notNull().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('technicians');
};
