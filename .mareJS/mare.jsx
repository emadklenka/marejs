import React, { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useMatch,
} from "react-router-dom";

import App from "../src/_app"; // The top-level layout

// Lazy-load all .jsx files from the /pages directory
const pages = import.meta.glob("../src/pages/**/*.jsx");
const layouts = import.meta.glob("../src/pages/**/layout.jsx");


// -----------------------------------------
// Step 1: Build a function to find all layouts
// -----------------------------------------
function findAllLayouts(filePath) {
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
}

// -----------------------------------------
// Step 2: Normalize paths (handle [slug] and (folder) cases)
// -----------------------------------------
function normalizePath(filePath) {
  let routePath = filePath
    .replace("../src/pages", "")
    .replace("/page.jsx", "")  // remove "page.jsx"
    .replace(".jsx", "")       // or remove any ".jsx" suffix
    .replace(/\[(\w+)\]/g, ":$1"); // handle dynamic routes e.g. [id] -> :id

  // Remove folder names wrapped in (...)
  routePath = routePath
    .split("/")
    .filter((segment) => !segment.startsWith("(") || !segment.endsWith(")"))
    .join("/");

  // Root path should be "/"
  routePath = routePath === "" ? "/" : routePath.replace(/\/$/, "");
  return routePath.toLowerCase();
}

// -----------------------------------------
// Step 3: Build a list of "route definitions" from our pages
// -----------------------------------------
const routeDefs = Object.keys(pages).map((filePath) => {
  const path = normalizePath(filePath);
  const PageComponent = React.lazy(pages[filePath]);
  const Layouts = findAllLayouts(filePath);

  return {
    path,
    component: PageComponent,
    layouts: Layouts,
  };
});

// Sort routes by the number of segments, to ensure
// more specific routes are matched first.
routeDefs.sort((a, b) => b.path.split("/").length - a.path.split("/").length);

// -----------------------------------------
// Step 4: A helper to wrap our component with its layouts
// -----------------------------------------
function ComponentWrapper({ Component, Layouts, path }) {
  const match = useMatch(path);
  // If this route matches, pass route params as props
  const params = match?.params || {};

  // Render the page component, then wrap progressively with each Layout
  let content = <Component {...params} />;
  for (let i = 0; i < Layouts.length; i++) {
    const Layout = Layouts[i];
    content = <Layout {...params}>{content}</Layout>;
  }

  return content;
}

// -----------------------------------------
// Step 5: Convert our route definitions 
// in the shape React Router's createBrowserRouter wants
// -----------------------------------------
// 
const children = routeDefs.map((r) => ({
  path: r.path === "/" ? "" : r.path, // so "/" doesn't conflict with parent's path
  element: (
    <ComponentWrapper
      Component={r.component}
      Layouts={r.layouts}
      path={r.path}
    />
  ),
}));

// Add a wildcard for not-found
children.push({
  path: "*",
  element: <NotFound />,
});


// Build the final config
const routesConfig = [
  {
    path: "/",
    element: <App />,
    children: children,
  },
];

// Create the browser router
const router = createBrowserRouter(routesConfig);

// -----------------------------------------
// The NotFound component
// -----------------------------------------
function NotFound() {
  return <>404 - Page Not Found</>;
}

// -----------------------------------------
// Step 7: Export your main component that uses RouterProvider
// -----------------------------------------
export default function Mare() {
  return (
    // <Suspense fallback={<div>Loading....</div>}>
    <RouterProvider router={router} />
    // </Suspense>
  );
}
