import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [cookies] = useCookies(["accessToken"]);
  const [userInfo, setUserInfo] = useState("");

  async function getUser(id) {
    try {
      let usersData = await axios.get(`http://localhost:4000/users/${id}`);
      return usersData.data
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    (async function checkCookie() {
      if(!cookies.accessToken){
        window.location.href = `http://localhost:3000/?redirectURL=${window.location.href}`;
      }
      if (cookies.accessToken) {
        try {
          let response = await axios.post(
            `http://localhost:3001/verifyToken/?url=${window.location.href}`,
            {
              token: cookies.accessToken,
            }
          );
          if (response.data.status === "success") {
            let userInfo = await getUser(response.data.userId);
            setUserInfo(userInfo);
          }
        } catch (err) {
          if (err.response.data.status === "fail") {
            window.location.href = `http://localhost:3000/?redirectURL=${window.location.href}`;
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
            <span>ID: {userInfo[0].id}</span> <span>{userInfo[0].username}</span>
          </div>
          <div className="userPersonal">
            <span>{userInfo[0].user_name}</span>{" "}
            <span>{userInfo[0].user_surname}</span>
          </div>
          <div className="emailInfo">
            <span>{userInfo[0].user_email}</span> <span>{userInfo[0].user_type}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
