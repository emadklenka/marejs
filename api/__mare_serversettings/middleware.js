 /**
  * MareJS middleware function
  * @param {Object} req - Express request object
  * @param {Object} res - Express response object
  * @param {Function} next - Express next middleware function
  */
 export  function  mareMiddleware(req, res, next) {
   // Add your middleware logic here
   next();
 }
 