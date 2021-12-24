import React from "react";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function UserCard({ user, handleDelete, setUpdateMode }) {
  const [cookies] = useCookies(["accessToken"]);
  let object = {username:"ataberk", password:"cat"}

  return (
    <div className="userContainer">
      <div className="leftSide">
        {user.id}
        <div className="userInfo">
          <div className="userInfoTop">
            {user.username} / {user.name} / user
          </div>
          <div className="userInfoBottom">{user.email}</div>
        </div>
      </div>
      <div className="rightSide">
        <button onClick={()=> {handleDelete(user.id)} }>Delete</button>
        <button onClick={()=> {setUpdateMode({show:true, id: user.id})}}>Update</button>
      </div>
    </div>
  );
}
