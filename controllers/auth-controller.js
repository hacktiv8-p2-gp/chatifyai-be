const { User } = require("../models");
const { comparePassword } = require("../helpers/bcrypt");
const { token } = require("../helpers/jwt");

class AuthController {
  static async login(req, rest, next) {
    try {
      const { email, password } = req.body;

      if (!email) {
        throw { name: "Empty Email" };
      }
      if (!password) {
        throw { name: "Empty Password" };
      }

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
