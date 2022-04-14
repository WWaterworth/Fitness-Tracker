import { Route, BrowserRouter } from "react-router-dom";
import { Home, Routines, MyRoutines, Activities, Nav, Login } from "./index";
import React, { useState, useEffect } from "react";

const App = () => {
  const [token, setToken] = useState("");
  const [routines, setRoutines] = useState([]);

  return (
    <>
      <main>
        <BrowserRouter>
          <Nav />
          <Route exact path="/">
            <Home />
          </Route>
          <Route exact path="/routines">
            <Routines routines={routines} setRoutines={setRoutines} />
          </Route>
          <Route exact path="/login">
            <Login token={token} setToken={setToken} />
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
