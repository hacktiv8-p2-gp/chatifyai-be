class ResponseError extends Error {
  constructor(message, statusCode) {
    super(message);
    statusCode = this.statusCode;
  }
}

module.exports = ResponseError;
