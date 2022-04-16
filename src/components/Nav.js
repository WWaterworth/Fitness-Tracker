import { Link } from "react-router-dom";

const Nav = ({ token }) => {
  return (
    <nav>
      {<Link to="/">Home |</Link>}
      <Link to="/activities"> Activities |</Link>
      <Link to="/routines"> Routines |</Link>
      {token ? <Link to="/myroutines"> My Routines |</Link> : null}
      <Link to="/login"> Login</Link>
    </nav>
  );
};

export default Nav;
