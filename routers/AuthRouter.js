const express = require("express");
const AuthRouter = express.Router();
const AuthController = require("../controllers/AuthController");

AuthRouter.post("/login", AuthController.login);
AuthRouter.post("/register", AuthController.register);

module.exports = AuthRouter;
