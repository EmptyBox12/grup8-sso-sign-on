import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cookies] = useCookies(["accessToken"]);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    (async function checkCookie() {
      if (cookies.accessToken) {
        try {
          let response = await axios.post(
            `http://localhost:3001/verifyToken/?url=${window.location.href}`,
            {
              token: cookies.accessToken,
            }
          );
          if (response.data.status === "success") {
            setUserInfo({
              user_id: "1",
              username: "ataberktumay",
              user_name: "Ataberk",
              user_surname: "Tümay",
              user_email: "fındık@gmail.com",
              user_type: "admin",
            });
          }
        } catch (err) {
          if (err.response.data.status === "fail") {
            window.location.href = `http://localhost:3000/?redirect=${window.location.href}`;
          }
        }
      }
    })();
  }, []);

  return (
    <div className="App">
      {userInfo && (
        <div className="userInfoContainer">
          <div className="title">User Information</div>
          <div className="idInfo">
            <span>ID: {userInfo.user_id}</span> <span>{userInfo.username}</span>
          </div>
          <div className="userPersonal">
            <span>{userInfo.user_name}</span> <span>{userInfo.user_surname}</span>
          </div>
          <div className="emailInfo">
            <span>{userInfo.user_email}</span> <span>{userInfo.user_type}</span>
             
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
