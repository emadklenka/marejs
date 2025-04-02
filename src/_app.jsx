
import { Suspense } from "react";
import { Outlet } from "react-router-dom";

 
import MainLayout from "./_MainLayout";
//Feel Free to change your Loader
export default function App( ){
return(<>
   <MainLayout>
 
    <Suspense fallback={<div>Loading....</div>}>
    <Outlet/>
    </Suspense>
    </MainLayout>
</>)

}
 