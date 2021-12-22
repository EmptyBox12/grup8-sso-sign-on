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
            if(response.data.status === "success"){
              setUserInfo({
                name:"Ataberk",
                surname:"Tümay",
                email:"fındık@gmail.com",
              })
            }
          } catch (err) {
            if (err.response.data.status === "fail") {
              window.location.href = `http://localhost:3000/?redirect=${window.location}`;
            }
          }
        }
      })();
  }, []);

  return (
    <div className="App">
      {userInfo && (
        <div>
          <p>{userInfo.name}</p>
          <p>{userInfo.surname}</p>
          <p>{userInfo.email}</p>
        </div>
      )}
    </div>
  );
}

export default App;
