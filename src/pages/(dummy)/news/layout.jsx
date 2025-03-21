import { Link ,   Outlet} from 'react-router-dom';

export default function LayoutNews({children ,id}){
 
    return (<> 
 
   <div style={{background:"red"}}>
   <div>news layout {id}</div>
   {children}
    </div>
    </>)
}