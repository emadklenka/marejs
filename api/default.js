export default (req, res) => {
    // you can comment the below and do your own route for not found folder based route

    res.status(404).json({ message: 'Not a valid route' });
  };