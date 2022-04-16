import { Route, BrowserRouter } from "react-router-dom";
import {
  Home,
  Routines,
  MyRoutines,
  Activities,
  Nav,
  Login,
  Register,
  AddActivities,
  SingleUser,
} from "./index";
import React, { useState, useEffect } from "react";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [activities, setActivities] = useState([]);
  const [singleUser, setSingleUser] = useState([]);

  return (
    <>
      <main>
        <BrowserRouter>
          <Nav />
          <Route exact path="/">
            <Home user={user} />
          </Route>
          <Route exact path="/routines">
            <Routines routines={routines} setRoutines={setRoutines} />
          </Route>
          <Route exact path="/login">
            <Login
              token={token}
              setToken={setToken}
              user={user}
              setUser={setUser}
              routines={routines}
              setRoutines={routines}
            />
          </Route>
          <Route exact path="/myroutines">
            <MyRoutines
              routines={routines}
              setRoutines={setRoutines}
              token={token}
              setToken={setToken}
            />
            <SingleUser
              singleUser={singleUser}
              setSingleUser={setSingleUser}
              token={token}
              routines={routines}
              user={user}
            />
          </Route>
          <Route exact path="/activities">
            <AddActivities
              token={token}
              setToken={setToken}
              activities={activities}
              setActivities={setActivities}
            />
            <Activities
              activities={activities}
              setActivities={setActivities}
              token={token}
              setToken={setToken}
            />
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
