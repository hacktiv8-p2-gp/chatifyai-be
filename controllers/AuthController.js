const { User } = require("../models");
const { comparePassword } = require("../helpers/Bcrypt");
const { token } = require("../helpers/Jwt");
const validate = require("../validation/Validate");
const { authValidation } = require("../validation/AuthValidation");
const { OAuth2Client } = require("google-auth-library");
const { use } = require("../routers/AuthRouter");
const client = new OAuth2Client();
require("dotenv").config();

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
        throw new ResponseError("Invalid email or password", 401);
      }

      if (!comparePassword(password, user.password)) {
        throw new ResponseError("Invalid email or password", 401);
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
        idToken: googleToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      const user = await User.findOne({
        where: {
          email: payload.email,
        },
      });

      if (!user) {
        await User.create({
          email: payload.email,
          password: Math.random().toString(),
        });
      }
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
