const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

module.exports = {
  username: 'postgres',
  password: process.env.DB_PASSWORD,
  database: 'postgres',
  host: process.env.DB_HOST,
  dialect: 'postgres',
  define: {
    timestamps: true,
    paranoid: true,
  },
};
