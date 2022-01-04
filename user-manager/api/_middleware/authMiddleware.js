const axios = require("axios");
//before every action check if the token is still valid
module.exports = async (req, res, next) => {
  try {
    //get token, url, and ip from headers and query
    let token = req.headers["authorization"].split(" ")[1];
    let ip = req.headers["ip"];
    let url = req.query.url;
    //post request to the sso-auth api verifyToken route 
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
    //if token is valid continue with the request
    if(response.data.status == "success"){
      next();
    }
    //if the token is invalid, return token fail status
  } catch (err) {
    return res.status(400).json({status: "token fail", msg: "Invalid token"});
  }
};
