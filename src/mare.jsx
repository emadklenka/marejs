import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";
import { useMatch } from "react-router-dom";
import App from "./_app"; // Import the Layout component

// Use Vite's `import.meta.glob` to dynamically load all .jsx files from the /pages directory
const pages = import.meta.glob("./pages/**/*.jsx");
const layouts = import.meta.glob("./pages/**/layout.jsx");

// Function to find all layout files in the parent directories
const findAllLayouts = (filePath) => {
  const parts = filePath.split("/");
  const layoutComponents = [];
  while (parts.length > 1) {
    parts.pop();
    const layoutPath = `${parts.join("/")}/layout.jsx`;
    if (layouts[layoutPath]) {
      layoutComponents.push(React.lazy(layouts[layoutPath]));
    }
  }
  return layoutComponents;
};

// Create a lazy-loaded component map for all the pages
const routes = Object.keys(pages).map((filePath) => {
  let routePath = filePath
    .replace("./pages", "")
    .replace("/page.jsx", "") // Handle page.jsx files as root for the folder
    .replace(".jsx", ""); // Remove .jsx extension

  routePath = routePath.replace(/\[(\w+)\]/g, ":$1"); // Handle dynamic routes
  routePath = routePath === "" ? "/" : routePath.replace(/\/$/, ""); // Normalize root path

  const Component = React.lazy(pages[filePath]);
  const Layouts = findAllLayouts(filePath);

  return {
    path: routePath,
    component: Component,
    layouts: Layouts,
    filePath:filePath //for debugging reasons
  };
});

// Component wrapper to pass dynamic params as props and wrap with all parent layouts
const ComponentWrapper = ({ Component, Layouts, path }) => {
  const match = useMatch(path);
  let content = <Component {...(match ? match.params : {})} />;
 
  for (let i = 0; i <= Layouts.length - 1; i++) {
    console.log( "layouts: "+Layouts[i])
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
  
  debugger
  return (
    <Router>
      {/*                 The app here acts as a holder layout for the entire app , */}
      <App> 
        <Suspense fallback={<div>Loading...</div>}>
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
