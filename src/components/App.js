import { Router as Link, Route, BrowserRouter } from "react-router-dom";
import { Home, Routines, Account, MyRoutines, Activities } from "./index";

const App = () => {
  return (
    <main>
      <div>I will be a cool front end some day</div>
      <BrowserRouter>
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
  );
};

export default App;
