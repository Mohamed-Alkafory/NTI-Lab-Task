const notFound = (req, res, next) => {
  return res
    .status(404)
    .json({ message: `Route ${req.originalUrl} not found` });
};

module.exports = { notFound };

