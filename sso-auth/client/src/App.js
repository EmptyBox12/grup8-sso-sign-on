import { useState } from "react";
import sha256 from "js-sha256";
import axios from "axios";

import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
      if(loginInfo.status == "success"){
        window.location.href = query + `?token=${loginInfo.accessToken}`; 
      }
    } catch (err) {
      console.log(err.response.data);
    }
  }

  return (
    <div className="App">
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
    </div>
  );
}

export default App;
