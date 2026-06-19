const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API not found!',
    error: {
      path: req.originalUrl,
      message: 'The requested route does not exist.',
    },
  });
};

export default notFound;