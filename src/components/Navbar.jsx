import React, { useContext,useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import Logo from "../img/logo.png";
import menuItems from "../components/menuItems"
import MenuItem from "../components/MenuItem"
const Navbar = () => {
  const { currentUser, logout } = useContext(AuthContext);
  const [dropdown, setDropdown] = useState(false);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
          <img src={Logo} alt="" />
          </Link>
        </div>
        <div className="menus">
        <ul className="menus">
        <span className="write">
            <Link className="link " to="/questions/write">
              Questions
            </Link>
          </span>
        {menuItems.map((menu, index) => {
          return <MenuItem items={menu} key={index} />;
        })}
      </ul>
          {currentUser&&(<div className="link">{currentUser.name}</div>)}

          {currentUser ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link className="link" to="/login">
              Login
            </Link>
          )}
          <span className="write">
            <Link className="link" to="/write">
              Write
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
