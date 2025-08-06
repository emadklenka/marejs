import session from "express-session"; 
export function getMareSession()
{
  // you can return null or valid session object or to be honest any middlewear
  //return null
   return session({
       secret: process.env.SESSION_SECRET || 'insecure_default_secret',
       resave: false,
       saveUninitialized: false,
       cookie: {
           secure: process.env.SECURE_COOKIES === 'true',
           httpOnly: true,
           sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
           maxAge: 1000 * 60 * 60 * 2 // 2 hours
       }
     })
}