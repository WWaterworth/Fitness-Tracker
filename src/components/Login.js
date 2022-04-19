import { useHistory } from "react-router-dom";
import React, { useState } from "react";
import { callApi } from "../api";

const Login = ({ token, setToken, setUser }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const result = await callApi({
        url: "/users/login",
        method: "POST",
        body: { username, password },
      });
      if (result) {
        setToken(result.token);
        setUser(result.user);
        history.push("/");
      } else {
        alert("username or password is invalid");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <h1> Login to Fitness Track.r</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="login username"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        ></input>
        <input
          type="password"
          placeholder="login password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
          }}
        ></input>
        <button type="submit">Submit</button>
      </form>
      {!token ? (
        <button onClick={() => history.push("/register")}> Register </button>
      ) : null}
    </>
  );
};
export default Login;
