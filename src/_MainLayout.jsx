import { Link } from "react-router-dom";
import { useEffect } from "react";
import { themeChange } from "theme-change";
import "../styles/global.css"; // Loads Tailwind and custom link class

/**
 * Main layout component using DaisyUI navbar
 * @param {object} props - React props
 * @param {ReactNode} props.children - Page content
 */
export default function MainLayout({ children }) {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <>
      <div className="min-h-screen flex flex-col bg-base-100 text-base-content">
        {/* Navbar */}
        <nav className="navbar bg-base-200 shadow-md px-4">
          <div className="flex-1">
            <Link to="/" className="btn btn-ghost text-xl">MareJS</Link>
          </div>
          <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/teams">Teams</Link></li>
              <li>
                {/* Theme switcher dropdown */}
                <div className="dropdown dropdown-end">
                  <div tabIndex={0} role="button" className="btn btn-ghost">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow-lg border border-base-300">
                    <li><button data-set-theme="mytheme" data-act-class="ACTIVECLASS">🌟 My Theme</button></li>
                    <li><button data-set-theme="light" data-act-class="ACTIVECLASS">☀️ Light</button></li>
                    <li><button data-set-theme="dark" data-act-class="ACTIVECLASS">🌙 Dark</button></li>
                    <li><button data-set-theme="cupcake" data-act-class="ACTIVECLASS">🧁 Cupcake</button></li>
                    <li><button data-set-theme="corporate" data-act-class="ACTIVECLASS">🏢 Corporate</button></li>
                    <li><button data-set-theme="synthwave" data-act-class="ACTIVECLASS">🌆 Synthwave</button></li>
                    <li><button data-set-theme="retro" data-act-class="ACTIVECLASS">📼 Retro</button></li>
                    <li><button data-set-theme="cyberpunk" data-act-class="ACTIVECLASS">🤖 Cyberpunk</button></li>
                    <li><button data-set-theme="valentine" data-act-class="ACTIVECLASS">💕 Valentine</button></li>
                    <li><button data-set-theme="halloween" data-act-class="ACTIVECLASS">🎃 Halloween</button></li>
                    <li><button data-set-theme="garden" data-act-class="ACTIVECLASS">🌱 Garden</button></li>
                    <li><button data-set-theme="forest" data-act-class="ACTIVECLASS">🌲 Forest</button></li>
                    <li><button data-set-theme="aqua" data-act-class="ACTIVECLASS">🌊 Aqua</button></li>
                    <li><button data-set-theme="lofi" data-act-class="ACTIVECLASS">🎵 Lo-Fi</button></li>
                    <li><button data-set-theme="pastel" data-act-class="ACTIVECLASS">🎨 Pastel</button></li>
                    <li><button data-set-theme="fantasy" data-act-class="ACTIVECLASS">🦄 Fantasy</button></li>
                    <li><button data-set-theme="wireframe" data-act-class="ACTIVECLASS">📐 Wireframe</button></li>
                    <li><button data-set-theme="black" data-act-class="ACTIVECLASS">⚫ Black</button></li>
                    <li><button data-set-theme="luxury" data-act-class="ACTIVECLASS">💎 Luxury</button></li>
                    <li><button data-set-theme="dracula" data-act-class="ACTIVECLASS">🧛 Dracula</button></li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </nav>

        {/* Page content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </>
  );
}