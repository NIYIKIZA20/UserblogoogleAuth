const dotenv = require('dotenv');
dotenv.config();
let getPrefix = () => {
  const env = process.env.ENV;

  if (!env) {
    return env = 'PG'
  }
  return env
};

const databaseConfig = () => {
  const env = getPrefix();
  console.log('the environmment variable:', env);
  return {
    username: process.env[`${env}USER`] || '',
    database: process.env[`${env}DATABASE`] || '',
    password: process.env[`${env}PASSWORD`] || '',
    host: process.env[`${env}HOST`] || '127.0.0.1',
    port: process.env[`${env}PORT`] || 5432,
    dialect: 'postgres'

  }
}

module.exports = databaseConfig