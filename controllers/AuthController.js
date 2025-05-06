class AuthController {
  static async login(req, rest, next) {
    try {
      const { email, password } = req.body;
      console.log(req.body);

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
