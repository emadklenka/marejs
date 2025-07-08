import { Link } from "react-router-dom";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import "../styles/global.css";

export default function MainLayout({ children }) {
  useEffect(() => {
    themeChange(false); // required for React
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
      {/* Navbar */}
      <nav className="navbar bg-base-200 shadow-md px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">MareJS</Link>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1 gap-2">
            <li><Link to="/" className="link">Home</Link></li>
            <li><Link to="/about" className="link">About</Link></li>
            <li><Link to="/news" className="link">News</Link></li>
            <li><Link to="/teams" className="link">Teams</Link></li>

            {/* Theme Toggle */}
            <li>
              <label className="swap swap-rotate btn btn-ghost text-xl">
                <input type="checkbox" className="theme-controller" value="dark" />
                <div className="swap-off">🌙</div>
                <div className="swap-on">☀️</div>
              </label>
            </li>
          </ul>
        </div>
      </nav>

      {/* Page content */}
      <main className="flex-1 p-6">
        {children}
      </main>
    </div>
  );
}