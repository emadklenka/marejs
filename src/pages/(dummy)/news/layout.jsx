import { Outlet } from 'react-router-dom';

/**
 * News layout component (dummy/test implementation)
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components
 * @param {string} [props.id] - Optional ID for the layout
 * @returns {JSX.Element} News layout structure
 */
export default function LayoutNews({ children, id }) {
  return (
    <div className="news-layout">
      <div className="news-header">News Layout {id}</div>
      <div className="news-content">
        {children}
        <Outlet />
      </div>
    </div>
  );
}