import cors from 'cors';
export   function getMarecors()
{   // you can return null or valid cors object or to be honest any middlewear
    return null
    return cors({
        origin: 'http://localhost:9999',  
        credentials: true
      })
}