//database connection için mysql2 ve sequalize kullanıldı.
//sequalize=migrate işlemlerine yardımcı olur.biz bir model yaptık sequalize database e anlatır.
//genel olarak burası connection işlemi +migrate işlemi
const config = require("../config.json");
const mysql = require("mysql2/promise");
const { Sequelize } = require("sequelize");

module.exports = db = {};

initialize();

async function initialize() {
  // create db if it doesn't already exist
  const { host, port, user, password, database } = config.database;
  const connection = await mysql.createConnection({
    host,
    port,
    user,
    password,
  });
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);

  // connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  // init models and add them to the exported db object
  db.User = require("../users/user.model")(sequelize);
  await sequelize.sync({ alter: true });

  // sync all models with database.User database tablosuna senkron ediyor.
  module.exports = db;
}
