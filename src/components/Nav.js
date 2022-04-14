import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
      <Link to="/">Home |</Link>
      <Link to="/activities"> Activities |</Link>
      <Link to="/routines"> Routines |</Link>
      <Link to="/myroutines"> My Routines |</Link>
      <Link to="/login"> Login</Link>
    </nav>
  );
};

export default Nav;
