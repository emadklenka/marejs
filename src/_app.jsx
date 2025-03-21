
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Link } from 'react-router-dom';

//The app is acting the default layout of the application
export default function App({children}){
return(<>
<nav>

 
<Link to="/">  Home</Link> &nbsp;
<Link to="/about">About</Link>  &nbsp;
<Link to="/news">News Main</Link> &nbsp;
<Link to="/teams">Teams Main</Link>  &nbsp;
<Link to="/news/55">Sub news </Link> &nbsp;
<Link to="/teams/55">Sub teams</Link>  &nbsp;

</nav>

This is _app.jsx which acts as a wrapper<br/>
 
    {/* {children} */}

    <Suspense fallback={<div>Loading....</div>}>
    <Outlet/>
    </Suspense>
</>)

}
 