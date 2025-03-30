import React, { Suspense } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  useMatch,
} from "react-router-dom";

import App from "../src/_app"; // The top-level layout

// Lazy-load all .jsx files from the /pages directory
const pages = import.meta.glob("../src/pages/**/*.jsx");
const layouts = import.meta.glob("../src/pages/**/layout.jsx", { eager: true });

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
      layoutComponents.push(layouts[layoutPath].default);
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
    .replace("/page.jsx", "")
    .replace(".jsx", "")
    .replace(/\[(\w+)\]/g, ":$1");

  routePath = routePath
    .split("/")
    .filter((segment) => !segment.startsWith("(") || !segment.endsWith(")"))
    .join("/");

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

routeDefs.sort((a, b) => b.path.split("/").length - a.path.split("/").length);

// -----------------------------------------
// Step 4: A helper to wrap our component with its layouts
// -----------------------------------------
function ComponentWrapper({ Component, Layouts, path }) {
  const match = useMatch(path);
  const params = match?.params || {};

  let content = (
    <Suspense fallback={<div>Loading page...</div>}>
      <Component {...params} />
    </Suspense>
  );

  Layouts.forEach((Layout) => {
    content = <Layout {...params}>{content}</Layout>;
  });

  return content;
}

// -----------------------------------------
// Step 5: Convert our route definitions to the shape createBrowserRouter expects
// -----------------------------------------
const children = routeDefs.map((r) => ({
  path: r.path === "/" ? "" : r.path,
  element: (
    <ComponentWrapper
      Component={r.component}
      Layouts={r.layouts}
      path={r.path}
    />
  ),
}));

children.push({
  path: "*",
  element: <NotFound />,
});

const routesConfig = [
  {
    path: "/",
    element: <App />,
    children: children,
  },
];

const router = createBrowserRouter(routesConfig);

// -----------------------------------------
// The NotFound component
// -----------------------------------------
function NotFound() {
  return <>404 - Page Not Found</>;
}

// -----------------------------------------
// Step 6: Export your main component
// -----------------------------------------
export default function Mare() {
  return <RouterProvider router={router} />;
}
