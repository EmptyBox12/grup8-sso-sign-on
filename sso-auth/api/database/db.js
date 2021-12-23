const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "admin",
  password: "123456",
  database: "users",
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
