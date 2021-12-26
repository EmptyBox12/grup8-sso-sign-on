const axios = require("axios");

module.exports = async (req, res, next) => {
  try {
    let token = req.headers["authorization"].split(" ")[1];
    let ip = req.headers["ip"];
    let url = req.query.url;
    console.log(token,ip,url);
    let response = await axios.post(
      `http://localhost:3001/verifyToken/?url=${url}`,
      {
        token: token,
      },
      {
        headers: {
          ip: ip,
        },
      }
    )
    if(response.data.status == "success"){
      next();
    }
  } catch (err) {
    return res.status(400).json({status: "token fail", msg: "Invald token"});
  }
};
