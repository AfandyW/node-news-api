const redis = require("redis");
const config = require("./../../config");
const client = redis.createClient(config.REDISHOST, config.REDISPORT);

exports.set = async (key, value) => {
  await client.connect();
  await client.set(key, JSON.stringify(value));
  await client.quit();
};

exports.get = async (key) => {
  await client.connect();
  let value = await client.get(key);
  value = JSON.parse(value);
  await client.quit();
  return value;
};

exports.delete = async (key) => {
  await client.connect();
  await client.del(key);
  await client.quit();
};
