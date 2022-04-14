import { Route, BrowserRouter } from "react-router-dom";
import {
  Home,
  Routines,
  MyRoutines,
  Activities,
  Nav,
  Login,
  Register,
} from "./index";
import React, { useState, useEffect } from "react";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);

  return (
    <>
      <main>
        <BrowserRouter>
          <Nav />
          <Route exact path="/">
            <Home user={user} />
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
          <Route exact path="/register">
            <Register
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
            />
          </Route>
        </BrowserRouter>
      </main>
    </>
  );
};

export default App;
