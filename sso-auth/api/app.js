const express = require("express");
const { v4: uuidv4 } = require("uuid");
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
app.use(express.urlencoded({ extended: true }));

app.post("/isAuthorized", (req, res) => {
  //must check if admin
  const { username, password } = req.body;
  connection.query(
    `SELECT username='${username}', user_password, id, user_type FROM user`,
    (err, results, fields) => {
      if (err) throw err;
      if (!results) {
        res.status(400).json({ status: "fail", msg: "username not found" });
      }
      let usernameData = Object.keys(results[0]);
      let username = usernameData[0].split("=")[1];

      let passwordData = Object.values(results[0]);
      let databsePassword = passwordData[1];

      let userIdData = Object.values(results[0]);
      let userId = userIdData[2];

      if (password === databsePassword) {
        let accessToken = uuidv4();
        let expireDate = new Date(Date.now());
        expireDate.setHours(expireDate.getHours() + 7);
        let dataDate = expireDate.toISOString().slice(0, 19).replace('T', ' ');
        connection.query(
          `INSERT INTO token (user_id, token, expire_date) VALUES ('${userId}', '${accessToken}','${dataDate}')`,
          (err, results, fields) => {
            if (err) throw err;
            console.log("added to database");
          }
        );
        res.status(200).json({
          status: "success",
          msg: "logged in",
          authorization: true,
          user_id: userId,
          accessToken: accessToken,
        });
      }
    }
  );
});

app.post("/verifyToken", (req, res) => {
  if (req.body.token == null) {
    res.status(400).json({ status: "fail", msg: "token not found" });
  } else {
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
          res
            .status(200)
            .json({ status: "success", msg: "token is valid", token, userId });
        }
      }
    );
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
