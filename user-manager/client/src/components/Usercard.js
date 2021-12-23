import React from "react";

export default function UserCard({ user }) {
  return (
    <div className="userContainer">
      <div className="leftSide">
        {user.id}
        <div className="userInfo">
          <div className="userInfoTop">
            {user.username} / {user.name} / user
          </div>
          <div className="userInfoBottom">
            {user.email}
          </div>
        </div>
      </div>
      <div className="rightSide">
        <button>Delete</button>
        <button>Update</button>
      </div>
    </div>
  );
}
