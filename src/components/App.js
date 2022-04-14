import { Route, BrowserRouter } from "react-router-dom";
import { Home, Routines, MyRoutines, Activities, Nav, Login } from "./index";
import React, { useState, useEffect } from "react";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  console.log("token", token);
  console.log("user", user);

  return (
    <>
      <main>
        <BrowserRouter>
          <Nav />
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/routines">
            <Routines />
          </Route>
          <Route exact path="/login">
            <Login
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
            />
          </Route>
          <Route exact path="/myroutines">
            <MyRoutines />
          </Route>
          <Route exact path="/activities">
            <Activities />
          </Route>
        </BrowserRouter>
      </main>
    </>
  );
};

export default App;
