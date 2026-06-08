import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import logoLatamPay from "../../assets/Logo.svg";
import { paths } from "../../routes/paths";
import { publicNavItems } from "../../routes/nav";
import type { NavItem } from "../../routes/nav";

export type PublicNavbarProps = {
  items?: NavItem[];
  brand?: string;
};

export function PublicNavbar({
  items = publicNavItems,
  brand = "LatamPay",
}: PublicNavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      className="
        fixed
        top-0
        left-0
        z-50
        w-full
        border-b
        border-white/10
        bg-slate-950
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-6
        "
      >
        {/* Logo */}
        <Link
          to={paths.home}
          onClick={closeMenu}
          className="flex items-center"
          aria-label={brand}
        >
          <img
            src={logoLatamPay}
            alt={brand}
            className="h-10 w-auto"
          />
        </Link>

        {/* Desktop Menu */}
        <ul
          className="
            hidden
            items-center
            gap-8
            md:flex
          "
        >
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `
                  transition-colors
                  ${
                    isActive
                      ? "text-cyan-400"
                      : "text-slate-300 hover:text-white"
                  }
                `
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop Actions */}
        <div
          className="
            hidden
            items-center
            gap-4
            md:flex
          "
        >
          <Link
            to={paths.login}
            className="
              rounded-xl
              border
              border-white/10
              px-5
              py-2
              text-slate-300
              transition-all
              hover:border-cyan-500/30
              hover:text-white
            "
          >
            Iniciar Sesión
          </Link>

          <Link
            to={paths.register}
            className="
              rounded-xl
              bg-cyan-500
              px-5
              py-2
              font-semibold
              text-slate-950
              transition-all
              hover:scale-105
            "
          >
            Crear Cuenta
          </Link>
        </div>

        {/* Mobile Button */}
        <button
          type="button"
          onClick={toggleMenu}
          className="
            text-white
            md:hidden
          "
        >
          {isMenuOpen ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div
          className="
            border-t
            border-white/10
            bg-slate-950/95
            backdrop-blur-xl
            md:hidden
          "
        >
          <ul className="flex flex-col p-6">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `
                    block
                    py-3
                    ${
                      isActive
                        ? "text-cyan-400"
                        : "text-slate-300"
                    }
                  `
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 p-6 pt-0">
            <Link
              to={paths.login}
              onClick={closeMenu}
              className="
                rounded-xl
                border
                border-white/10
                py-3
                text-center
                text-slate-300
              "
            >
              Iniciar Sesión
            </Link>

            <Link
              to={paths.register}
              onClick={closeMenu}
              className="
                rounded-xl
                bg-cyan-500
                py-3
                text-center
                font-semibold
                text-slate-950
              "
            >
              Crear Cuenta
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default PublicNavbar;