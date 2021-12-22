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

  useEffect(() => {
    if (checkQuery) {
      (async function checkCookie() {
        if (cookies.accessToken) {
          console.log(cleanUrl());
          try {
            let response = await axios.post(
              `http://localhost:3001/verifyToken/?url=${cleanUrl()}`,
              {
                token: cookies.accessToken,
              }
            );
            if (response.data.status === "success") {
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
    //should get salt from an api
    let salt = "alotech";
    let hashedPass = sha256(password + salt);
    try {
      let query = window.location.search.substring(1).split("=")[1];
      let loginData = await axios.post(
        `http://localhost:3001/isAuthorized/?redirectURL=${query}`,
        { username: username, password: hashedPass }
      );
      let loginInfo = loginData.data;
      if (loginInfo.status === "success") {
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
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="username"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="password"
            required
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button type="submit">Login</button>
        </form>
      )}
    </div>
  );
}

export default App;
