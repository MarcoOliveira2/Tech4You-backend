module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'admin',
      password: 'ipca',
      database: 'tech4youdb',
    },
    debug: false,
    migrations: {
      directory: './src/migrations',
    },
    seeds: {
      directory: 'src/seeds',
    },
    pool: {
      min: 0,
      max: 50,
      propagateCreateError: false,
    },
  },
};
