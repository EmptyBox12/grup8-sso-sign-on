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
      values.user_password = "";
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
    validationSchema: Yup.object().shape({
      username: Yup.string().required("You need to enter a username"),
      user_name: Yup.string().required("You need to enter a name"),
      user_surname: Yup.string().required("You need to enter a surname"),
      user_password: Yup.string()
        .required("You need to enter a password")
        .min(6, "Can't be shorter than 6")
        .max(20, "Can't be longer than 20"),
      user_type: Yup.string().required("You need to select a type"),
      user_email: Yup.string()
        .email("You need to enter a valid email")
        .required("You need to enter a email"),
    }),
  });
  return (
    <>
      <form onSubmit={formik.handleSubmit} className="updateForm">
        <div className="form-element">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="error">{formik.errors.username}</div>
          ) : null}
        </div>
        <div className="form-element">
          <label htmlFor="user_name">Name</label>
          <input
            type="text"
            name="user_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.user_name}
          />
          {formik.touched.user_name && formik.errors.user_name ? (
            <div className="error">{formik.errors.user_name}</div>
          ) : null}
        </div>
        <div className="form-element">
          <label htmlFor="user_surname">Surname</label>
          <input
            type="text"
            name="user_surname"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.user_surname}
          />
          {formik.touched.user_surname && formik.errors.user_surname ? (
            <div className="error">{formik.errors.user_surname}</div>
          ) : null}
        </div>
        <div className="form-element">
          <label htmlFor="user_password">Password</label>
          <input
            type="password"
            name="user_password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.user_password}
          />
          {formik.touched.user_password && formik.errors.user_password ? (
            <div className="error">{formik.errors.user_password}</div>
          ) : null}
        </div>
        <div className="radio">
          <input
            type="radio"
            name="user_type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value="admin"
          />
          <label htmlFor="user_type">admin</label>
          <input
            type="radio"
            name="user_type"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value="user"
            checked="true"
          />
          <label htmlFor="user_type">user</label>
        </div>
        <div className="form-element">
          <label htmlFor="user_email">Email</label>
          <input
            type="text"
            name="user_email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.user_email}
          />
          {formik.touched.user_email && formik.errors.user_email ? (
            <div className="error">{formik.errors.user_email}</div>
          ) : null}
        </div>
        <button type="submit">Create</button>
      </form>
    </>
  );
}
