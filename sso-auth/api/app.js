const express = require("express");
const app = express();
const port = 3001;

const mysql = require("mysql");
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pass123",
  database: "users",
  multipleStatements: true,
});

connection.connect();
//midlewares
app.use(express.json());

app.post("/login", (req, res) => {});

app.post("/verifyToken", (req, res) => {
  connection.query(
    `SELECT token='${req.body.token}', expire_date, user_id FROM token`,
    (err, results, fields) => {
      if (err) throw err;
      if (!results) {
        res.status(400).json({ status: "fail", msg: "token not found" });
      }
      let tokenData = Object.keys(results[0]);
      let token = tokenData[0].split("=")[1];

      let expireData = Object.values(results[0]);
      let expire = expireData[1];

      let userIdData = Object.values(results[0]);
      let userId = userIdData[2];

      let expireDate = new Date(expire);
      let now = Date.now();

      if (now > expireDate) {
        res.status(400).json({ status: "fail", msg: "Token expired" });
      } else {
        res.status(200).json({ status: "success", msg: "token is valid" , token, userId});
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
