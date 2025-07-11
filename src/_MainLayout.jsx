 
import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function MainLayout({ children }) {
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

            {/* ✅ Use ThemeToggle component here */}
            <li><ThemeToggle /></li>
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

function ThemeToggle() {
  useEffect(() => {
    const root = document.documentElement;
    const toggle = document.querySelector("#theme-toggle input");

    const storedTheme = localStorage.getItem("theme") || "light";
    root.setAttribute("data-theme", storedTheme);
    if (toggle) toggle.checked = storedTheme === "dark";

    toggle?.addEventListener("change", () => {
      const newTheme = toggle.checked ? "dark" : "light";
      root.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }, []);

  return (
    <label id="theme-toggle" className="swap swap-rotate cursor-pointer">
      <input type="checkbox" />
      <div className="swap-on text-xl">🌞</div>
      <div className="swap-off text-xl">🌙</div>
    </label>
  );
}
