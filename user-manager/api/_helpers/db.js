//Mysql2 and Sequalize are used for Database connection
//Connection+Migration processes
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

  //Connect to db
  const sequelize = new Sequelize(database, user, password, {
    dialect: "mysql",
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  //init models and add them to the exported db object
  db.User = require("../users/user.model")(sequelize);
  await sequelize.sync({ alter: true });
  // sync all models with database.Syncs the model to the database table.
  module.exports = db;
}
