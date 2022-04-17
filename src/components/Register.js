import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { callApi } from "../api";

const Register = ({ token, setToken, user, setUser }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password.length <= 7) {
        const error = alert("Password is too short");
        return error;
      }

      const result = await callApi({
        url: "/users/register",
        method: "POST",
        body: { username, password },
      });
      if (token) {
        setToken(result.token);
        setUser(result.user);
        history.push("/");
      } else {
        alert("username already exists");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <h1>This is the register page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(event) => {
            console.log(event.target.value);
            setUsername(event.target.value);
          }}
        ></input>
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(event) => {
            console.log(event.target.value);
            setPassword(event.target.value);
          }}
        ></input>
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default Register;
