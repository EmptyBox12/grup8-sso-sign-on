import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Usercard from "./components/Usercard";
import Update from "./components/Update";
import Create from "./components/Create";
import "./App.css";

function App() {
  const [cookies] = useCookies(["accessToken"]);
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [updateMode, setUpdateMode] = useState({ show: false, id: 0 });
  const [createMode, setCreateMode] = useState(false);

  async function getIP() {
    let response = await axios.get("http://api.ipify.org/?format=json");
    let userIP = response.data.ip;
    return userIP;
  }
//check access token
  useEffect(() => {
    (async function checkCookie() {
      if (!cookies.accessToken) {
        window.location.href = `${process.env.REACT_APP_SSO_LOGIN}/?redirectURL=${window.location.href}`;
      }
      if (cookies.accessToken) {
        try {
          let userIP = await getIP();
          let response = await axios.post(
            `${process.env.REACT_APP_SSO_API}/verifyToken/?url=${window.location.href}`,
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
            setLoggedIn(true);
          }
        } catch (err) {
          console.log(err);
          if (err.response.data.status === "fail") {
            window.location.href = `${process.env.REACT_APP_SSO_LOGIN}/?redirectURL=${window.location.href}`;
          }
        }
      }
    })();
  }, []);
  async function getUsers() {
    try {
      let userIP = await getIP();
      let usersData = await axios.get(
        `${process.env.REACT_APP_USER_API}/users/?url=${window.location.href}`,
        { headers: { authorization: `Bearer ${cookies.accessToken}`, ip: userIP } }
      );
      console.log(usersData.data);
      if (JSON.stringify(usersData.data) != JSON.stringify(users)) {
        setUsers(usersData.data);
      }
    } catch (err) {
      if (err.response.data.status === "token fail") {
        window.location.href = `${process.env.REACT_APP_SSO_LOGIN}/?redirectURL=${window.location.href}`;
      } else {
        alert(err.response.data.message);
      }
    }
  }
//get list of users if access token is valid
  useEffect(() => {
    if (loggedIn === true) {
      (async function getListOfUsers() {
        try {
          await getUsers();
        } catch (err) {
          console.log(err);
        }
      })();
    }
  }, [loggedIn, users]);

  async function handleDelete(id) {
    try {
      let userIP = await getIP();
      const data = await axios.delete(
        `${process.env.REACT_APP_USER_API}/users/${id}/?url=${window.location.href}`,
        {
          headers: { authorization: `Bearer ${cookies.accessToken}` , ip: userIP},
        }
      );
      let newUsers = users.filter((user) => user.id != id);
      setUsers(newUsers);
    } catch (err) {
      console.log(err.response);
      if (err.response.data.status === "token fail") {
        window.location.href = `${process.env.REACT_APP_SSO_LOGIN}/?redirectURL=${window.location.href}`;
      } else {
        console.log(err.response);
      }
    }
  }

  return (
    <div className="App">
      <Navbar setCreateMode={setCreateMode} setUpdateMode={setUpdateMode} />

      {users && !updateMode.show && !createMode && (
        <div className="userCardContainer">
          {users.map((user, index) => {
            return (
              <Usercard
                user={user}
                handleDelete={handleDelete}
                setUpdateMode={setUpdateMode}
                key={index}
              />
            );
          })}
        </div>
      )}

      {updateMode.show && (
        <div className="updateContainer">
          <Update
            setUsers={setUsers}
            updateMode={updateMode}
            users={users}
            setUpdateMode={setUpdateMode}
          />
        </div>
      )}
      {createMode && (
        <div className="updateContainer">
          <Create
            setUsers={setUsers}
            setCreateMode={setCreateMode}
            users={users}
          />
        </div>
      )}
    </div>
  );
}

export default App;
