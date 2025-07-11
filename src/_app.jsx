/**
 * Main application component that sets up the layout and routing
 * @returns {JSX.Element} The application root component
 */
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "./_MainLayout";
import "../styles/global.css";
 


export default function App() {

 

  return (
    <MainLayout>
      {/*
        Suspense boundary for lazy-loaded routes
        Replace the fallback with your custom loader component
      */}
      <Suspense fallback={<div>🌀🌀Loading🌀🌀</div>}>
        <Outlet />
      </Suspense>
    </MainLayout>
  );
}
 