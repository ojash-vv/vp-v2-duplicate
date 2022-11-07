const dbUser = process.env.MONGO_USER || "test";
const dbPass = process.env.MONGO_PASS || "test";

module.exports = {
  port: process.env.PORT || 6000,
  dbUrl: `mongodb+srv://${dbUser}:${dbPass}@db-jonqt.mongodb.net/db`,
};
