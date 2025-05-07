const express = require("express");
const { getAll, request } = require("../controllers/FriendController");

const FriendRouter = express.Router();

FriendRouter.get("/", getAll);
FriendRouter.get("/request", request);

module.exports = FriendRouter;
