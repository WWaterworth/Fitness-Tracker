import { useParams, useHistory } from "react-router-dom";
import { useState } from "react";
import { callApi } from "../api";

const Login = (setToken, setUser) => {
  const params = useParams();
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await callApi({
      url: `/users/${params.method}`,
      method: "POST",
      body: { username, password },
    });

    if (result) {
      const userData = await callApi({
        url: "/users/me",
        token: result.token,
      });
      setToken(result.token);
      setUser({ username });
      if (result.token) {
        history.push("/");
      }
    }
  };

  return (
    <>
      <h1>This is the login page</h1>
    </>
  );
};

export default Login;
