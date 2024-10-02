import session from "express-session"; 
export function getMareSession()
{
  // you can return null or valid session object or to be honest any middlewear
  //return null
   return session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }
      })
}