const ResponseError = require("../helpers/ResponseError");

const ErrorMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
  }

  if (err instanceof ResponseError) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  }

  res.status(500).json({
    message: "Internal Server Error",
  });

  next();
};

module.exports = ErrorMiddleware;
