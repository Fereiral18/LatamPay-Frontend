import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, Wallet, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { paths } from "../../routes/paths";
import { privateNavItems } from "../../routes/nav";
import type { NavItem } from "../../routes/nav";

export type PrivateNavbarProps = {
  items?: NavItem[];
  brand?: string;
};

export function PrivateNavbar({
  items = privateNavItems,
  brand = "LatamPay",
}: PrivateNavbarProps) {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="fixed top-0 left-0 z-50 w-full border-b border-white/10 bg-slate-950">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

        {/* Logo */}
        <Link
          to={paths.dashboard}
          onClick={closeMenu}
          className="flex items-center gap-2 text-xl font-bold text-white"
        >
          <Wallet size={28} className="text-cyan-400" />
          <span>{brand}</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `transition-colors ${isActive ? "text-cyan-400" : "text-slate-300 hover:text-white"}`
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop user */}
        <div className="hidden items-center gap-4 md:flex">
          <span className="text-sm text-slate-400">{user?.name}</span>
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm text-slate-300 transition-all hover:border-red-500/30 hover:text-red-400"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
          className="text-white md:hidden"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-white/10 bg-slate-950/95 backdrop-blur-xl md:hidden">
          <ul className="flex flex-col p-6">
            {items.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  onClick={closeMenu}
                  className={({ isActive }) =>
                    `block py-3 ${isActive ? "text-cyan-400" : "text-slate-300"}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-3 p-6 pt-0">
            <span className="text-sm text-slate-400">{user?.email}</span>
            <button
              type="button"
              onClick={logout}
              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 py-3 text-sm text-red-400"
            >
              <LogOut size={16} />
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

export default PrivateNavbar;
