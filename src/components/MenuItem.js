import Dropdown from './Dropdown';
import { useEffect, useState } from 'react';
const MenuItem = ({ items }) => {
    const [dropdown, setDropdown] = useState(false);
    useEffect(() => {
        const closeMenu = () => {
           setDropdown(false);
        };
        window.addEventListener('click', closeMenu);
        return () => {
            window.removeEventListener('click', closeMenu);
        };
    }, []);
  return (
    <li className="menu-items">
          <button type="button" aria-haspopup="menu"
          aria-expanded={dropdown ? "true" : "false"}
      onClick={(e) =>{ e.stopPropagation(); setDropdown((prev) => !prev)}}>
            {items.title}{' '}
          </button>
          <Dropdown submenus={items.submenu} dropdown={dropdown}  />
    </li>
  );
};

export default MenuItem;