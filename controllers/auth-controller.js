const { User } = require("../models");
const { comparePassword } = require("../helpers/Bcrypt");
const { token } = require("../helpers/Jwt");
const validate = require("../validation/Validate");
const { authValidation } = require("../validation/AuthValidation");

class AuthController {
  static async register(req, rest, next) {
    try {
      const { email, password } = validate(authValidation, req.body);

      const createUser = await User.create({ email, password });

      console.log(createUser);

      rest.status(200).json({
        id: createUser.id,
        email: createUser.email,
        message: "User created successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  static async login(req, rest, next) {
    try {
      const { email, password } = validate(authValidation, req.body);

      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        throw { name: "Invalid email or password" };
      }

      if (!comparePassword(password, user.password)) {
        throw { name: "Invalid email or password" };
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      const access_token = token(payload);

      rest.status(200).json({
        message: access_token,
      });
    } catch (error) {
      next(error);
    }
  }

  static async x(req, rest, next) {
    try {
      rest.status(200).json({
        message: "Hello World!",
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

module.exports = AuthController;
