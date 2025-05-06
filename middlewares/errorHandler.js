const errorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  console.log(err);

  if (err.name === "Empty Email") {
    statusCode = 400;
    message = "Email is required";
  }

  if (err.name === "Empty Password") {
    statusCode = 400;
    message = "Password is required";
  }

  if (err.name === "Invalid email or password") {
    statusCode = 401;
    message = "Invalid email or password";
  }

  if (err.name === "Not Found") {
    statusCode = 404;
    message = "Not Found";
  }

  res.status(statusCode).json({
    message: message,
  });
};

module.exports = errorHandler;
