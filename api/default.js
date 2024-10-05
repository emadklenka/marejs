// if route is not matching a file on the disk here is the last point
// 
export default (req, res) => {
    // you can comment the below and do your own route for not found folder based route
 
   
     res.status(404).send('MareJS Server API route not found');
     return
    //You can have your own default API route here
  };