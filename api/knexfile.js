module.exports = {
  test: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'postgres',
      password: 'Oliveira2',
      database: 'pessoal',
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
