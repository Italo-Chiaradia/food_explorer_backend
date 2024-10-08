exports.up = knex => knex.schema.createTable("dishes", table => {
  table.increments("id");
  table.integer("user_id").references("id").inTable("users");

  table.text("img");
  table.text("title").notNullable();
  table.text("description").notNullable();
  table.decimal('price', 10, 2).notNullable();
  table.enum("category", ["refeição", "sobremesa", "bebida"], {useNative: true, enumName: "categories"})
    .notNullable()
    .default("refeição");
  table.timestamp("created_at").default(knex.fn.now());
  table.timestamp("updated_at").default(knex.fn.now());
});

exports.down = knex => knex.schema.dropTable("dishes");
