import React from "react";

export default function UserCard({ user, handleDelete, setUpdateMode }) {
  
  return (
    <div className="userContainer">
      <div className="leftSide">
        {user.id}
        <div className="userInfo">
          <div className="userInfoTop">
            {user.username} / {user.user_name} {user.user_surname}
          </div>
          <div className="userInfoBottom">{user.user_email} / {user.user_type}</div>
        </div>
      </div>
      <div className="rightSide">
        <button onClick={()=> {handleDelete(user.id)} }>Delete</button>
        <button onClick={()=> {setUpdateMode({show:true, id: user.id})}}>Update</button>
      </div>
    </div>
  );
}
