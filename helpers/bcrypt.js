const bcrypt = require("bcryptjs");

const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password);
  return hash;
};

const comparePassword = (password, hash) => {
  const isValid = bcrypt.compareSync(password, hash);
  return isValid;
};

module.exports = {
  hashPassword,
  comparePassword,
};
