
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

//The app is acting the default layout of the application
export default function App({children}){
return(<>
This is _app.jsx which acts as a wrapper<br/>
 
    {/* {children} */}

    <Suspense fallback={<div>Loading....</div>}>
    <Outlet/>
    </Suspense>
</>)

}