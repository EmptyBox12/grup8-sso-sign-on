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
  const [updateMode, setUpdateMode] = useState({show:false, id:0});
  const [createMode, setCreateMode] = useState(false);


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
            setLoggedIn(true);
          }
        } catch (err) {
          console.log(err);
          if (err.response.data.status === "fail") {
            window.location.href = `http://localhost:3000/?redirectURL=${window.location.href}`;
          }
        }
      }
    })();
  }, []);
  async function getUsers() {
    try {
      let usersData = await axios.get("http://localhost:4000/users");
      console.log(usersData.data);
      if(JSON.stringify(usersData.data)!= JSON.stringify(users)){
        setUsers(usersData.data);
      }
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
  }, [loggedIn, users]);

  async function handleDelete(id) {
    try {
      const data = await axios.delete(`http://localhost:4000/users/${id}/?url=${window.location.href}`, {
        headers: { "authorization": `Bearer ${cookies.accessToken}` },
      });
      let newUsers = users.filter((user) => user.id != id);
      setUsers(newUsers);
    } catch (err) {
      if (err.response.data.status === "token fail") {
        window.location.href = `http://localhost:3000/?redirectURL=${window.location.href}`;
      } else {
        console.log(err.response);
      }
    }
  }

  return (
    <div className="App">
      <Navbar setCreateMode={setCreateMode} setUpdateMode={setUpdateMode} />
      
        {users && !updateMode.show && !createMode &&
        <div className="userCardContainer">
         { users.map((user, index) => {
            return <Usercard user={user} handleDelete={handleDelete} setUpdateMode= {setUpdateMode} key={index}/>;
          })}
          </div>
          }
          
        {updateMode.show && 
          <div className="updateContainer">
            <Update setUsers = {setUsers}  updateMode={updateMode} users={users} setUpdateMode= {setUpdateMode}/>
          </div>
        }
        {createMode &&
          <div className="updateContainer">
            <Create setUsers= {setUsers} setCreateMode = {setCreateMode} users = {users} />
          </div>
        }
      
    </div>
  );
}

export default App;
