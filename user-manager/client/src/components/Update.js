import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Update({ setUsers, updateMode, users, setUpdateMode }) {
  const [cookies] = useCookies(["accessToken"]);
  let id = updateMode.id;
  let index = users.findIndex(item => item.id === id);

  //after update, get users again and show them from the database
  async function handleUpdate(id, object) {
    // try {
    //   const data = await axios.put(`url/${id}/?url=window.location.href`, {object}, {headers:{"authorization": `Bearer ${cookies.accessToken}` }});
    //   let newUsers = [...users];
    //   let index = newUsers.indexOf(item => item.id == id);
    //   newUsers[index] = object;
    //   setUsers(newUsers);
    // } catch (err) {
    //   if (err.response.data.status === "token fail") {
    //     window.location.href = `http://localhost:3000/?redirect=${window.location.href}`;
    //   }
    // }
    let newUsers = [...users];
    object.id = id;
    newUsers[index] = object;
    setUsers(newUsers);
    setUpdateMode({ show: false, id: 0 });
  }
  const formik = useFormik({
    initialValues: {
      username: users[index].username,
      name: users[index].name,
      userSurname: "",
      userPassword: "",
      userType: "user",
      email: users[index].email,
    },
    onSubmit: (values) => {
      handleUpdate(id, values);
    },
  });

  return (
    <>
      <form onSubmit={formik.handleSubmit} className="updateForm">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
        />
        <label htmlFor="userName">Name</label>
        <input
          type="text"
          name="name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
        />
        <label htmlFor="userSurname">Surname</label>
        <input
          type="text"
          name="userSurname"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.userSurname}
        />
        <label htmlFor="userPassword">Password</label>
        <input
          type="text"
          name="userPassword"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.userPassword}
        />
        <label htmlFor="userType">User Type</label>
        <input
          type="text"
          name="userType"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.userType}
        />
        <label htmlFor="userEmail">Email</label>
        <input
          type="text"
          name="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
        />
        <button type="submit">Update</button>
      </form>
    </>
  );
}
