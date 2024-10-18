
exports.up = function(knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary()
        table.string('name').notNull()
        table.string('email').notNull().unique()
        table.string('password').notNull()
        table.boolean('admin').notNull().defaultTo(false)
    })  
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};


// knex migrate:make create_table_users
// knex migrate:make add_deleted_at_table_users

// knex migrate:latest