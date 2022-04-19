import { Link } from "react-router-dom";
const Nav = ({ token }) => {
  return (
    <nav>
      <Link className="home" to="/">
        Home
      </Link>
      <Link className="activities" to="/activities">
        Activities
      </Link>
      <Link className="routines" to="/routines">
        Routines
      </Link>
      {token ? (
        <Link className="myRoutines" to="/myroutines">
          My Routines
        </Link>
      ) : null}
      {!token ? (
        <Link className="login" to="/login">
          {" "}
          Login
        </Link>
      ) : null}
      {token ? (
        <Link className="logout" to="/logout">
          {" "}
          Logout
        </Link>
      ) : null}
    </nav>
  );
};
export default Nav;
