require("dotenv").config();

module.exports = {
  PORT: process.env.PORT,
  URLDB: process.env.URLMongo,
  REDISPORT: process.env.REDISPORT,
  REDISHOST: process.env.REDISHOST,
};
