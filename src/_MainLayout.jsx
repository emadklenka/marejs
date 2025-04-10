import { Outlet, Link } from "react-router-dom";

/**
 * Main layout component containing navigation and content area
 * @returns {JSX.Element} The application layout structure
 */
export default function MainLayout() {
  return (
    <>
      <nav className="main-nav">
        <ul className="nav-list">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/news">News</Link></li>
          <li><Link to="/teams">Teams</Link></li>
        </ul>
      </nav>
      
      <main className="content-area">
        <Outlet />
      </main>
    </>
  );
}