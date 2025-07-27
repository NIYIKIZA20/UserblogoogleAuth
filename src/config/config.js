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
  // console.log(process.env[`${env}_USERNAME`])
  return {
    username: process.env[`${env}USER`] || '',
    database: process.env[`${env}DATABASE`] || '',
    password: process.env[`${env}PASSWORD`] || '',
    host: process.env[`${env}HOST`] || '',
    port: process.env[`${env}PORT`] || 5433,
    dialect: 'postgres'

  }
}

module.exports = databaseConfig