const mysql = require("mysql");
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  multipleStatements: true,
});

connection.connect((error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("connected...");
  }
});

module.exports = connection;
