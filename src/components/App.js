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
  UserRoutines,
  Logout,
} from "./index";
import React, { useState, useEffect } from "react";

const App = () => {
  const [token, setToken] = useState("");
  const [user, setUser] = useState([]);
  const [routines, setRoutines] = useState([]);
  const [activities, setActivities] = useState([]);
  const [userRoutines, setUserRoutines] = useState([]);

  return (
    <>
      <main>
        <BrowserRouter>
          <Nav token={token} />
          <Route exact path="/">
            <Home user={user} />
          </Route>
          <Route exact path="/routines">
            <Routines routines={routines} setRoutines={setRoutines} />
          </Route>
          <Route exact path="/login">
            <Login token={token} setToken={setToken} setUser={setUser} />
          </Route>
          <Route exact path="/myroutines">
            <MyRoutines
              routines={routines}
              setRoutines={setRoutines}
              token={token}
              setToken={setToken}
              setUserRoutines={setUserRoutines}
              user={user}
            />
            <UserRoutines
              activities={activities}
              setActivities={setActivities}
              userRoutines={userRoutines}
              setUserRoutines={setUserRoutines}
              token={token}
              user={user}
            />
          </Route>
          <Route exact path="/activities">
            <AddActivities token={token} setActivities={setActivities} />
            <Activities activities={activities} setActivities={setActivities} />
          </Route>
          <Route exact path="/register">
            <Register token={token} setToken={setToken} setUser={setUser} />
          </Route>
          <Route exact path="/logout">
            <Logout setUser={setUser} setToken={setToken} />
          </Route>
        </BrowserRouter>
      </main>
    </>
  );
};

export default App;
