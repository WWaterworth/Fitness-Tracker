import { Link } from "react-router-dom";

const Nav = ({ token }) => {
  return (
    <nav>
      {<Link to="/">Home |</Link>}
      <Link to="/activities"> Activities |</Link>
      <Link to="/routines"> Routines |</Link>
      {token ? <Link to="/myroutines"> My Routines |</Link> : null}
      {!token ? <Link to="/login"> Login</Link> : null}
      {token ? <Link to="/logout"> Logout</Link> : null}
    </nav>
  );
};

export default Nav;
