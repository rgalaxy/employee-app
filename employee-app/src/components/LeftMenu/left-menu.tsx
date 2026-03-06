import { NavLink } from "react-router-dom";
import "./left-menu.css";

interface LeftMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { label: "Wizard", path: "/wizard" },
  { label: "Employee List", path: "/employee-list" },
];

export default function LeftMenu({ isOpen, onClose }: LeftMenuProps) {
  return (
    <>
      <div
        className={`left-menu__overlay${isOpen ? " left-menu__overlay--visible" : ""}`}
        aria-hidden="true"
        onClick={onClose}
      />

      <nav
        id="left-menu"
        className={`left-menu${isOpen ? " left-menu--open" : ""}`}
        aria-label="Main navigation"
      >
        <ul className="left-menu__list" role="list">
          {menuItems.map(({ label, path }) => (
            <li key={path} className="left-menu__item">
              <NavLink
                to={path}
                className={({ isActive }) =>
                  `left-menu__link${isActive ? " left-menu__link--active" : ""}`
                }
                onClick={onClose}
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
