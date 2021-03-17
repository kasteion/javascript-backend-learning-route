require("dotenv").config();

const config = {
  port: process.env.PORT || 3000,
  dbUrl: process.env.DB_URL,
};

module.exports = config;
