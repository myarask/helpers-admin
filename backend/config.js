const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  username: 'myarask@helpers-test',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  host: 'helpers-test.postgres.database.azure.com',
  dialect: 'postgres',
  define: {
    timestamps: true,
    paranoid: true,
  },
};
