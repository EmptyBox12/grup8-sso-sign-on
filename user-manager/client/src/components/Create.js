import React, { useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";
import sha256 from "js-sha256";
import * as Yup from "yup";

export default function Create({ setUsers, setCreateMode, users }) {
  const [cookies] = useCookies(["accessToken"]);

  async function handleCreate(values) {
    try {
      values.user_password = sha256(values.user_password + "alotech");
      const data = await axios.post(
        `http://localhost:4000/users/?url=${window.location.href}`,
        {
          username: values.username,
          user_name: values.user_name,
          user_surname: values.user_surname,
          user_password: values.user_password,
          user_email: values.user_email,
          user_type: values.user_type,
        },
        { headers: { authorization: `Bearer ${cookies.accessToken}` } }
      );
      let newUsers = [...users];
      newUsers.push(values);
      setUsers(newUsers);
      setCreateMode(false);
    } catch (err) {
      console.log(err);
      values.user_password ="";
      if (err.response.data.status === "token fail") {
        window.location.href = `http://localhost:3000/?redirectURL=${window.location.href}`;
      } else {
        alert(err.response.data.message);
      }
    }
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      user_name: "",
      user_surname: "",
      user_password: "",
      user_type: "",
      user_email: "",
    },
    onSubmit: async (values) => {
      await handleCreate(values);
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
        <label htmlFor="user_name">Name</label>
        <input
          type="text"
          name="user_name"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.user_name}
        />
        <label htmlFor="user_surname">Surname</label>
        <input
          type="text"
          name="user_surname"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.user_surname}
        />
        <label htmlFor="user_password">Password</label>
        <input
          type="password"
          name="user_password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.user_password}
        />
        <label htmlFor="user_type">User Type</label>
        <input
          type="text"
          name="user_type"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.user_type}
        />
        <label htmlFor="user_email">Email</label>
        <input
          type="text"
          name="user_email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.user_email}
        />
        <button type="submit">Create</button>
      </form>
    </>
  );
}
