const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/../../.env` });

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: 'postgres',
  },
  test: {
    username: process.env.TEST_DB_USERNAME || 'ci_user',
    password: process.env.TEST_DB_PASSWORD,
    database: process.env.TEST_DB_DATABASE || 'ci_db',
    host: process.env.TEST_DB_HOST || 'postgres',
    dialect: 'postgres',
    logging: false,
  },
};
