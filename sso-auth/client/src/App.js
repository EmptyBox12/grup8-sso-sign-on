import { useState, useEffect } from "react";
import sha256 from "js-sha256";
import axios from "axios";
import { useCookies } from "react-cookie";

import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkQuery, setCheckQuery] = useState(false);
  const [cookies, setCookie, removeCookie] = useCookies(["accessToken"]);
  //get user ip
  async function getIP() {
    let response = await axios.get("http://api.ipify.org/?format=json");
    let userIP = response.data.ip;
    return userIP;
  }
  //clean query
  function cleanUrl() {
    let url = window.location.search;
    let cleanUrl = url.split("=")[1];
    return cleanUrl;
  }
  //check query
  useEffect(() => {
    if (window.location.search) {
      setCheckQuery(true);
    }
  }, []);
  //verify token and redirect or login
  useEffect(() => {
    if (checkQuery) {
      (async function checkCookie() {
        if (cookies.accessToken) {
          console.log(cleanUrl());
          try {
            let userIP = await getIP();
            //verify if token is valid
            let response = await axios.post(
              `http://localhost:3001/verifyToken/?url=${cleanUrl()}`,
              {
                token: cookies.accessToken,
              },
              {
                headers: {
                  ip: userIP,
                },
              }
            );
            if (response.data.status === "success") {
              //if token is valid redirect back to the query url
              let query = window.location.search.substring(1).split("=")[1];
              window.location.href = query;
            }
          } catch (err) {
            console.log(err.response.data);
          }
        }
      })();
    }
  }, [checkQuery]);

  async function handleSubmit(e) {
    e.preventDefault();
    //initial hashing. it gets hashed in the back-end one more time
    let salt = "alotech";
    let hashedPass = sha256(password + salt);
    try {
      let userIP = await getIP();
      let query = window.location.search.substring(1).split("=")[1];
      let loginData = await axios.post(
        `http://localhost:3001/isAuthorized/?redirectURL=${query}`,
        { username: username, password: hashedPass },
        {
          headers: {
            ip: userIP,
          },
        }
      );
      let loginInfo = loginData.data;
      if (loginInfo.status === "success") {
        //if login is successful set cookie and redirect
        setCookie("accessToken", loginInfo.accessToken, { path: "/" });
        window.location.href = query;
      }
    } catch (err) {
      alert(err.response.data.msg);
    }
  }

  return (
    <div className="App">
      {checkQuery && (
        <form onSubmit={handleSubmit} className="form">
          <div className="nameContainer">
            <span className="login">Login</span>
            Enter your username:
            <input
              className="input"
              type="text"
              placeholder="username"
              required
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
          <div className="passwordContainer">
            Enter your password:
            <input
              className="input"
              type="password"
              placeholder="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <button className="submitButton" type="submit">
            Login
          </button>
        </form>
      )}
    </div>
  );
}

export default App;
