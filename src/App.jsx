import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

// Use Vite's `import.meta.glob` to dynamically load all .jsx files from the /pages directory
const pages = import.meta.glob('./pages/**/*.jsx');

// Create a lazy-loaded component map for all the pages
const routes = Object.keys(pages).map((filePath) => {
  // Get the route path by removing the "./pages" and ".jsx" part of the file path
  const routePath = filePath
    .replace('./pages', '')
    .replace('/index.jsx', '')  // Handle index.jsx files as root for the folder
    .replace('.jsx', '');

  // Return a route definition with lazy loading
  const Component = React.lazy(pages[filePath]);

  return {
    path: routePath === '' ? '/' : routePath,  // Empty path means the root path
    component: Component,
  };
});

// Not Found component
const NotFound = () => {
  return (
    <div>
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you're looking for doesn't exist.</p>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {routes.map(({ path, component: Component }) => (
            <Route key={path} path={path} element={<Component />} />
          ))}
          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
