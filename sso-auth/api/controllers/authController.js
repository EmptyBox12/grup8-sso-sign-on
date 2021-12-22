const db = require("../database/db");
const { v4: uuidv4 } = require("uuid");

exports.isAuthorized = (req, res) => {
  let query = req.query.redirectURL;
  let stringUrl = query.split("http://")[1];
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
      let userTypeData = Object.values(results[0]);
      let userType = userTypeData[2];
      if (
        stringUrl === "localhost:3020" ||
        stringUrl === "localhost:3020/" ||
        stringUrl === "localhost:3020 "
      ) {
        if (userType == "user") {
          return res.status(400).json({ status: "fail", msg: "not admin" });
        }
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
        let urlList ="";
        if(userType == "user"){
          urlList = "localhost:3010";
        } else if(userType =="admin"){
          urlList = "localhost:3010, localhost:3040";
        }
        db.query(
          `INSERT INTO token (user_id, token, expire_date, url) VALUES ('${userId}', '${accessToken}','${dataDate}', '${urlList}')`,
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
  //check request url. when login add urls to token
  if (req.body.token == null) {
    return res.status(400).json({ status: "fail", msg: "token not found" });
  } else {
    try {
      db.query(
        `SELECT expire_date, user_id, url FROM token WHERE token='${req.body.token}'`,
        (err, results, fields) => {
          if (err) {
            return res
              .status(400)
              .json({ status: "fail", msg: "token not found" });
          }
          if (results.length == 0) {
            return res
              .status(400)
              .json({ status: "fail", msg: "token not found" });
          }
          let token = req.body.token;

          let query = req.query.url;
          let stringUrl = query.split("http://")[1];
          let urlData = Object.values(results[0]);
          let url = urlData[2];
          let urlArray = url.split(", ");
          let newString = stringUrl.replace(/\s+/g, '');
          let cleanUrl = newString.replace(/\//g, '');
          if(!urlArray.includes(cleanUrl)){
            return res.status(400).json({status:"fail", msg:"you don't have permission"})
          }
          
          let expireData = Object.values(results[0]);
          let expire = expireData[0];

          let userIdData = Object.values(results[0]);
          let userId = userIdData[1];

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
