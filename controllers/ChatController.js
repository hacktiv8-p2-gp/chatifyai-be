class ChatController {
  static async x(req, rest, next) {
    try {
      rest.status(200);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
