import { Router as Link, Route, BrowserRouter } from "react-router-dom";
import { Home, Routines } from "./index";

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
      </BrowserRouter>
    </main>
  );
};

export default App;
