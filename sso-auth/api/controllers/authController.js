const db = require("../database/db");

exports.isAuthorized = (req, res) => {
  //must check if admin
  const { username, password } = req.body;
  db.query(
    `SELECT user_password, id, user_type FROM user WHERE username='${username}'`,
    (err, results, fields) => {
      if (err) throw err;
      if (!results || results.length == 0) {
        return res
          .status(400)
          .json({ status: "fail", msg: "username not found" });
      }

      let passwordData = Object.values(results[0]);
      let databasePassword = passwordData[0];

      let userIdData = Object.values(results[0]);
      let userId = userIdData[1];

      if (password === databasePassword) {
        let accessToken = uuidv4();
        let expireDate = new Date(Date.now());
        if (expireDate.getHours() + 7)
          expireDate.setHours(expireDate.getHours() + 6);
        let dataDate = expireDate.toISOString().slice(0, 19).replace("T", " ");
        db.query(
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
      } else {
        return res
          .status(400)
          .json({ status: "fail", msg: "password doesn't match" });
      }
    }
  );
};

exports.isTokenValid = (req, res) => {
  if (req.body.token == null) {
    return res.status(400).json({ status: "fail", msg: "token not found" });
  } else {
    try {
      db.query(
        `SELECT expire_date, user_id FROM token WHERE token='${req.body.token}'`,
        (err, results, fields) => {
          if (err) {
            console.log(results);
            return res
              .status(400)
              .json({ status: "fail", msg: "token not found" });
          }
          if (results.length == 0) {
            return res
              .status(400)
              .json({ status: "fail", msg: "token not found" });
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
            res.status(200).json({
              status: "success",
              msg: "token is valid",
              token,
              userId,
            });
          }
        }
      );
    } catch (e) {
      return res.status(400).json({ status: "fail", msg: "token not found" });
    }
  }
};
