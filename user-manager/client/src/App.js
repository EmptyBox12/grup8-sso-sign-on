import { useCookies } from "react-cookie";
import { useState, useEffect } from "react";
import React from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import Usercard from "./components/Usercard";
import "./App.css";

function App() {
  const [cookies] = useCookies(["accessToken"]);
  const [users, setUsers] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);

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
            setLoggedIn(true);
          }
        } catch (err) {
          console.log(err);
          if (err.response.data.status === "fail") {
            window.location.href = `http://localhost:3000/?redirect=${window.location.href}`;
          }
        }
      }
    })();
  }, []);
  async function getUsers() {
    try {
      let users = await axios.get("https://jsonplaceholder.typicode.com/users");
      console.log(users.data);
      setUsers(users.data);
    } catch (err) {
      console.log(err);
    }
  }

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
  }, [loggedIn]);

  return (
    <div className="App">
      <Navbar />
      <div className="userCardContainer">
      {users && users.map((user) => {
        return (
        <Usercard user = {user} />
        )
      })}
      </div>
    </div>
  );
}

export default App;
