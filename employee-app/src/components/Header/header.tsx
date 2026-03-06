import "./header.css";
import { useRole } from "../../context/RoleContext";

interface HeaderProps {
  isMenuOpen?: boolean;
  onMenuToggle?: () => void;
}

export default function Header({
  isMenuOpen = false,
  onMenuToggle,
}: HeaderProps) {
  const { role, setRole } = useRole();

  const handleToggle = () => {
    setRole(role === "Admin" ? "Ops" : "Admin");
  };

  const isOps = role === "Ops";

  return (
    <header className="header">
      <div className="header__inner">
        <div className="header__left">
          <button
            type="button"
            className="header__hamburger"
            aria-label={
              isMenuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isMenuOpen}
            aria-controls="left-menu"
            onClick={onMenuToggle}
          >
            {isMenuOpen ? (
              <span className="header__hamburger-icon" aria-hidden="true">
                ✕
              </span>
            ) : (
              <span className="header__hamburger-icon" aria-hidden="true">
                <span />
                <span />
                <span />
              </span>
            )}
          </button>
          <span className="header__brand">Employee App v1</span>
        </div>

        <div className="header__controls">
          <div className="header__toggle">
            <span
              className={`header__toggle-label${!isOps ? " header__toggle-label--active" : ""}`}
            >
              Admin
            </span>

            <button
              type="button"
              role="switch"
              aria-checked={isOps}
              aria-label={`Switch role, currently ${role}`}
              className={`header__toggle-track${isOps ? " header__toggle-track--ops" : ""}`}
              onClick={handleToggle}
            >
              <span className="header__toggle-thumb" />
            </button>

            <span
              className={`header__toggle-label${isOps ? " header__toggle-label--active" : ""}`}
            >
              Ops
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
