exports.up = (knex) => {
  return knex.schema.createTable('equipments', (t) => {
    t.increments('id').primary();
    t.enu('typeEquipment', ['Desktop', 'Laptop', 'Tablet', 'Phone', 'Printer', 'Monitor', 'Other']).notNull();
    t.string('serialNumber').notNull().unique();
    t.string('brand').notNull();
    t.string('accessories').notNull();
    t.string('damages').notNull();
    t.integer('client_id')
      .references('id')
      .inTable('clients')
      .notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable('equipments');
};
