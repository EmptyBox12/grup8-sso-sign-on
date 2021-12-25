import React, {useState} from 'react';
import axios from "axios";
import { useCookies } from "react-cookie";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Create({}) {

  async function handleCreate(values) {
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
    newUsers.push(values);
    setUsers(newUsers);
    setCreateMode(false);
  }

  const formik = useFormik({
    initialValues: {
      username: "",
      name: "",
      userSurname: "",
      userPassword: "",
      userType: "",
      email: "",
    },
    onSubmit: async (values) => {
      
    },
  });
  return (
    <div>
      
    </div>
  )
}
