const ResponseError = require("../helpers/ResponseError");

function validate(schema, data) {
  const { error, value } = schema.validate(data);

  if (error) {
    const errorMessage = error.details[0].message;

    throw new ResponseError(errorMessage, 400);
  }

  return value;
}

module.exports = validate;
