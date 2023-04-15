import React from "react";
import Logo from "../img/logo.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo} alt="" />
      <span>
       Maintained By <a href="https://www.linkedin.com/in/naveen-p-71b9771b1">Naveen P</a> 
      </span>
    </footer>
  );
};

export default Footer;
