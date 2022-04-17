import React from "react";
import { useHistory } from "react-router-dom";

const Logout = ({ setToken, setUser }) => {
  const history = useHistory();
  const handleLogout = () => {
    setToken("");
    setUser([]);
  };

  return (
    <>
      <main>
        <h1>Logging out here</h1>
        <button
          onClick={() => {
            handleLogout();
            history.push("/login");
          }}
        >
          Log out
        </button>
      </main>
    </>
  );
};

export default Logout;
