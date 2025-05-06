const { User } = require("../models");
const { comparePassword } = require("../helpers/Bcrypt");
const { token } = require("../helpers/Jwt");
const validate = require("../validation/Validate");
const { authValidation } = require("../validation/AuthValidation");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

class AuthController {
  // Register
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

  // Login Email
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

  // Google Login
  static async googleLogin(req, rest, next) {
    try {
      const { googleToken } = req.body;

      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: WEB_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const userid = payload["sub"];
      // If the request specified a Google Workspace domain:
      // const domain = payload['hd'];

      rest.status(200).json({
        message: "Hello World!",
      });
    } catch (error) {
      console.log(error);
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
