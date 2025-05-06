const ResponseError = require("../helpers/ResponseError");

const errorHandler = (err, req, res, next) => {
  if (!err) {
    next();
  }

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof ResponseError) {
    statusCode = err.statusCode || 500;
    message = err.message || "Internal Server Error";
  }

  res.status(statusCode).json({
    message: message,
  });

  next();
};

module.exports = errorHandler;
