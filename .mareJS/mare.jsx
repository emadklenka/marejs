import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { useMatch } from "react-router-dom";
import App from "../src/_app"; // Import the Layout component

// Use Vite's `import.meta.glob` to dynamically load all .jsx files from the /pages directory
const pages = import.meta.glob("../src/pages/**/*.jsx");
const layouts = import.meta.glob("../src/pages/**/layout.jsx");

// Function to find all layout files in the parent directories
const findAllLayouts = (filePath) => {
  const parts = filePath.split("/");

  const layoutComponents = [];

  while (parts.length > 1) {
    parts.pop();

    // Adjust to ensure paths match the structure returned by `import.meta.glob`

    const layoutPath = `${parts.join("/")}/layout.jsx`;

    if (layouts[layoutPath]) {
      layoutComponents.push(React.lazy(layouts[layoutPath]));
    }
  }

  return layoutComponents;
};

// Create a lazy-loaded component map for all the pages
const routes = Object.keys(pages).map((filePath) => {
  let routePath = normalizePath(filePath);

  routePath = routePath.replace(/\[(\w+)\]/g, ":$1"); // Handle dynamic routes
  routePath = routePath === "" ? "/" : routePath.replace(/\/$/, ""); // Normalize root path
  routePath = routePath.toLowerCase();

  const Component = React.lazy(pages[filePath]);
  const Layouts = findAllLayouts(filePath);

  return {
    path: routePath,
    component: Component,
    layouts: Layouts,
  };
});

// Sort routes by the number of segments (more segments first)
routes.sort((a, b) => b.path.split("/").length - a.path.split("/").length);

console.log("routes", routes);

// Component wrapper to pass dynamic params as props and wrap with all parent layouts
const ComponentWrapper = ({ Component, Layouts, path }) => {
  const match = useMatch(path);
  let content = <Component {...(match ? match.params : {})} />;

  for (let i = 0; i <= Layouts.length - 1; i++) {
    const Layout = Layouts[i];
    content = <Layout {...(match ? match.params : {})}>{content}</Layout>;
  }

  return content;
};

// Function to create nested routes with layouts
const createRoutes = (routes) => {
  return routes.map(({ path, component: Component, layouts: Layouts }) => (
    <Route key={path} path={path} element={<ComponentWrapper Component={Component} Layouts={Layouts} path={path} />}>
      {routes
        .filter((route) => route.path.startsWith(path) && route.path !== path)
        .map((nestedRoute) => (
          <Route
            key={nestedRoute.path}
            path={nestedRoute.path.replace(`${path}/`, "")}
            element={<ComponentWrapper Component={nestedRoute.component} Layouts={nestedRoute.layouts} path={nestedRoute.path} />}
          />
        ))}
    </Route>
  ));
};

// Main Mare component with Layout wrapping all routes
export default function Mare() {
  return (
    <Router>
      <App>
        <Suspense fallback={<div>Loading....</div>}>
          <Routes>
            <Route path="/" element={<div />} /> {/* Empty layout content for root */}
            {createRoutes(routes)}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </App>
    </Router>
  );
}

// Not Found component for catch-all route
const NotFound = () => {
  return <>404 - Page Not Found</>;
};
//////////////
// Function to normalize the route path, handling folder names with `()` by excluding them from the path
function normalizePath(filePath) {
  let routePath = filePath
    .replace("../src/pages", "")
    .replace("./pages", "")
    .replace("/page.jsx", "") // Handle index.jsx files as root for the folder
    .replace(".jsx", "") // Remove .jsx extension
    .replace(/\[(\w+)\]/g, ":$1"); // Handle dynamic routes

  // Remove folder names wrapped in ()
  routePath = routePath
    .split("/")
    .filter((segment) => !segment.startsWith("(") || !segment.endsWith(")"))
    .join("/");

  routePath = routePath === "" ? "/" : routePath.replace(/\/$/, ""); // Normalize root path
  return routePath.toLowerCase();
}
