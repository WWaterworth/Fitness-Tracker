import { Route, BrowserRouter } from "react-router-dom";
import { Home, Routines, Account, MyRoutines, Activities, Nav } from "./index";

const App = () => {
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
          <Route exact path="/account">
            <Account />
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
