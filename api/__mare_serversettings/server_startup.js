 
export async function  Server_Startup() {
 try{
//put ur app mandatory startup here
 
//console.log("SQL CONNECTION SUCCESS")
 
 
  
return true;    
 

 }catch(e){

console.log(`API SERVER FAILED TO STARTUP.....due to someting wrong in Server_Startup.js`)
return false;

 }
return true;
}

